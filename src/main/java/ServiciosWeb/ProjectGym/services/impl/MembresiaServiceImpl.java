package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.MembresiaRequest;
import ServiciosWeb.ProjectGym.dto.response.MembresiaResponse;
import ServiciosWeb.ProjectGym.entities.Membresia;
import ServiciosWeb.ProjectGym.entities.Usuario;
import ServiciosWeb.ProjectGym.exceptions.BadRequestException;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.MembresiaRepository;
import ServiciosWeb.ProjectGym.repositories.UsuarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.MembresiaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembresiaServiceImpl implements MembresiaService {

    private final MembresiaRepository membresiaRepository;
    private final UsuarioRepository usuarioRepository;

    public MembresiaServiceImpl(MembresiaRepository membresiaRepository,
                                UsuarioRepository usuarioRepository) {
        this.membresiaRepository = membresiaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public MembresiaResponse crearMembresia(MembresiaRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con id: " + request.getIdUsuario()
                ));

        // Validar si ya tiene membresía
        if (usuario.getMembresia() != null) {
            throw new BadRequestException("Este usuario ya tiene una membresía activa");
        }

        Membresia m = new Membresia();
        m.setTipo(request.getTipo());
        m.setFechaInicio(request.getFechaInicio());
        m.setFechaFin(request.getFechaFin());
        m.setUsuario(usuario);

        Membresia guardada = membresiaRepository.save(m);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public MembresiaResponse obtenerMembresiaPorId(int idMembresia) {
        Membresia m = membresiaRepository.findById(idMembresia)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membresía no encontrada con id: " + idMembresia
                ));
        return mapToResponse(m);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembresiaResponse> listarMembresias() {
        return membresiaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MembresiaResponse actualizarMembresia(int idMembresia, MembresiaRequest request) {
        Membresia m = membresiaRepository.findById(idMembresia)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membresía no encontrada con id: " + idMembresia
                ));

        if (request.getTipo() != null) m.setTipo(request.getTipo());
        if (request.getFechaInicio() != null) m.setFechaInicio(request.getFechaInicio());
        if (request.getFechaFin() != null) m.setFechaFin(request.getFechaFin());

        Membresia actualizada = membresiaRepository.save(m);
        return mapToResponse(actualizada);
    }

    @Override
    public void eliminarMembresia(int idMembresia) {
        Membresia m = membresiaRepository.findById(idMembresia)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membresía no encontrada con id: " + idMembresia
                ));
        membresiaRepository.delete(m);
    }

    /* ---- Helper ---- */

    private MembresiaResponse mapToResponse(Membresia m) {
        MembresiaResponse r = new MembresiaResponse();
        r.setIdMembresia(m.getIdMembresia());
        r.setTipo(m.getTipo());
        r.setFechaInicio(m.getFechaInicio());
        r.setFechaFin(m.getFechaFin());
        r.setIdUsuario(m.getUsuario().getIdUsuario());
        return r;
    }
}
