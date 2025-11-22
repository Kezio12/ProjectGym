package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.ClaseRequest;
import ServiciosWeb.ProjectGym.dto.response.ClaseResponse;
import ServiciosWeb.ProjectGym.entities.Actividad;
import ServiciosWeb.ProjectGym.entities.Clase;
import ServiciosWeb.ProjectGym.entities.Entrenador;
import ServiciosWeb.ProjectGym.entities.Horario;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.ActividadRepository;
import ServiciosWeb.ProjectGym.repositories.ClaseRepository;
import ServiciosWeb.ProjectGym.repositories.EntrenadorRepository;
import ServiciosWeb.ProjectGym.repositories.HorarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.ClaseService;
import ServiciosWeb.ProjectGym.repositories.ReservaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClaseServiceImpl implements ClaseService {

    private final ClaseRepository claseRepository;
    private final ActividadRepository actividadRepository;
    private final EntrenadorRepository entrenadorRepository;
    private final HorarioRepository horarioRepository;
    private final ReservaRepository reservaRepository;

    public ClaseServiceImpl(
            ClaseRepository claseRepository,
            ActividadRepository actividadRepository,
            EntrenadorRepository entrenadorRepository,
            HorarioRepository horarioRepository,
            ReservaRepository reservaRepository
    ) {
        this.claseRepository = claseRepository;
        this.actividadRepository = actividadRepository;
        this.entrenadorRepository = entrenadorRepository;
        this.horarioRepository = horarioRepository;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public ClaseResponse crearClase(ClaseRequest request) {

        Actividad actividad = actividadRepository.findById(request.getIdActividad())
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada"));

        Entrenador entrenador = entrenadorRepository.findById(request.getIdEntrenador())
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));

        Horario horario = null;

        if (request.getIdHorario() != null) {
            horario = horarioRepository.findById(request.getIdHorario())
                    .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
        }

        Clase c = new Clase();
        c.setFechaHora(request.getFechaHora());
        c.setCupoMaximo(request.getCupoMaximo());
        c.setActividad(actividad);
        c.setEntrenador(entrenador);
        c.setHorario(horario);

        Clase guardada = claseRepository.save(c);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public ClaseResponse obtenerClasePorId(int idClase) {
        Clase c = claseRepository.findById(idClase)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));
        return mapToResponse(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaseResponse> listarClases() {
        List<ClaseResponse> clases = claseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        //DEBUG - Ver qué se está enviando al frontend
        System.out.println("🚀 DEBUG - Enviando " + clases.size() + " clases al frontend:");
        clases.forEach(c -> {
            System.out.println("   Clase ID: " + c.getIdClase() +
                    " | Cupo Máximo: " + c.getCupoMaximo() +
                    " | Cupos Disponibles: " + c.getCuposDisponibles());
        });

        return clases;
    }

    @Override
    public ClaseResponse actualizarClase(int idClase, ClaseRequest request) {

        Clase c = claseRepository.findById(idClase)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));

        if (request.getFechaHora() != null) c.setFechaHora(request.getFechaHora());
        if (request.getCupoMaximo() != null) c.setCupoMaximo(request.getCupoMaximo());

        if (request.getIdActividad() != null) {
            Actividad actividad = actividadRepository.findById(request.getIdActividad())
                    .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada"));
            c.setActividad(actividad);
        }

        if (request.getIdEntrenador() != null) {
            Entrenador entrenador = entrenadorRepository.findById(request.getIdEntrenador())
                    .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
            c.setEntrenador(entrenador);
        }

        if (request.getIdHorario() != null) {
            Horario horario = horarioRepository.findById(request.getIdHorario())
                    .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
            c.setHorario(horario);
        }

        return mapToResponse(claseRepository.save(c));
    }

    @Override
    public void eliminarClase(int idClase) {
        Clase c = claseRepository.findById(idClase)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));
        claseRepository.delete(c);
    }

    /* ---- Helper ---- */

    private ClaseResponse mapToResponse(Clase c) {
        ClaseResponse r = new ClaseResponse();
        r.setIdClase(c.getIdClase());
        r.setFechaHora(c.getFechaHora());
        r.setCupoMaximo(c.getCupoMaximo());
        r.setIdActividad(c.getActividad().getIdActividad());
        r.setIdEntrenador(c.getEntrenador().getIdEntrenador());
        r.setIdHorario(c.getHorario() != null ? c.getHorario().getIdHorario() : null);

        // ✅ DEBUG - Calcular cupos disponibles
        long reservasCount = reservaRepository.countByClaseIdClase(c.getIdClase());
        System.out.println("DEBUG Clase ID: " + c.getIdClase() +
                ", Cupo Máximo: " + c.getCupoMaximo() +
                ", Reservas Count: " + reservasCount +
                ", Cupos Disponibles: " + (c.getCupoMaximo() - reservasCount));

        r.setCuposDisponibles((int) (c.getCupoMaximo() - reservasCount));

        return r;
    }
}
