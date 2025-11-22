package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.ReservaRequest;
import ServiciosWeb.ProjectGym.dto.response.ReservaResponse;
import ServiciosWeb.ProjectGym.entities.Clase;
import ServiciosWeb.ProjectGym.entities.Reserva;
import ServiciosWeb.ProjectGym.entities.Usuario;
import ServiciosWeb.ProjectGym.exceptions.BadRequestException;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.ClaseRepository;
import ServiciosWeb.ProjectGym.repositories.ReservaRepository;
import ServiciosWeb.ProjectGym.repositories.UsuarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.ReservaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClaseRepository claseRepository;

    public ReservaServiceImpl(
            ReservaRepository reservaRepository,
            UsuarioRepository usuarioRepository,
            ClaseRepository claseRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
        this.claseRepository = claseRepository;
    }

    @Override
    public ReservaResponse crearReserva(ReservaRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Clase clase = claseRepository.findById(request.getIdClase())
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));

        /* Validar que no supere el cupo */
        long reservasActuales = reservaRepository.countByClaseIdClase(clase.getIdClase());
        if (reservasActuales >= clase.getCupoMaximo()) {
            throw new BadRequestException("La clase está llena, no hay cupos disponibles.");
        }

        /* Validar que el usuario no haya reservado antes */
        boolean yaReservo = reservaRepository.existsByUsuarioIdUsuarioAndClaseIdClase(
                usuario.getIdUsuario(),
                clase.getIdClase()
        );

        if (yaReservo) {
            throw new BadRequestException("El usuario ya tiene una reserva en esta clase.");
        }

        Reserva r = new Reserva();
        r.setFechaReserva(request.getFechaReserva());
        r.setClase(clase);
        r.setUsuario(usuario);
        r.setEstado("ACTIVA");

        Reserva guardada = reservaRepository.save(r);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservaResponse obtenerReservaPorId(int idReserva) {
        Reserva r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));
        return mapToResponse(r);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarReserva(int idReserva) {
        Reserva r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));
        reservaRepository.delete(r);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> obtenerReservasPorUsuario(int usuarioId) {
        // Verificar que el usuario existe
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId);
        }

        return reservaRepository.findByUsuarioIdUsuario(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ---- Helper ---- */

    private ReservaResponse mapToResponse(Reserva r) {
        ReservaResponse resp = new ReservaResponse();
        resp.setIdReserva(r.getIdReserva());
        resp.setFechaReserva(r.getFechaReserva());
        resp.setIdUsuario(r.getUsuario().getIdUsuario());
        resp.setIdClase(r.getClase().getIdClase());
        resp.setEstado(r.getEstado());
        return resp;
    }
}
