package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.UsuarioRequest;
import ServiciosWeb.ProjectGym.dto.response.UsuarioResponse;
import ServiciosWeb.ProjectGym.entities.Rol;
import ServiciosWeb.ProjectGym.entities.Usuario;
import ServiciosWeb.ProjectGym.exceptions.BadRequestException;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.RolRepository;
import ServiciosWeb.ProjectGym.repositories.UsuarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @Override
    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        // Validar email único
        Optional<Usuario> existente = usuarioRepository.findByEmail(request.getEmail());
        if (existente.isPresent()) {
            throw new BadRequestException("Ya existe un usuario con el email indicado");
        }

        // Validar rol
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + request.getIdRol()));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setTelefono(request.getTelefono());
        usuario.setPassword(request.getPassword());
        usuario.setRol(rol);

        Usuario guardado = usuarioRepository.save(usuario);
        return mapToResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerUsuarioPorId(int idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + idUsuario));
        return mapToResponse(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponse actualizarUsuario(int id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Actualizar campos
        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }

        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            //Verificar que el nuevo email no exista en otro usuario
            usuarioRepository.findByEmail(request.getEmail())
                    .ifPresent(existingUser -> {
                        if (existingUser.getIdUsuario() != id) { // Solo si es un usuario diferente
                            throw new BadRequestException("El email ya está en uso por otro usuario");
                        }
                    });
            usuario.setEmail(request.getEmail());
        }

        if (request.getTelefono() != null) {
            usuario.setTelefono(request.getTelefono());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(request.getPassword()); // En producción, hashear aquí
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return mapToResponse(usuarioActualizado);
    }

    @Override
    public void eliminarUsuario(int idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + idUsuario));
        usuarioRepository.delete(usuario);
    }

    /* ----- Helpers ----- */

    private UsuarioResponse mapToResponse(Usuario usuario) {
        UsuarioResponse r = new UsuarioResponse();
        r.setIdUsuario(usuario.getIdUsuario());
        r.setNombre(usuario.getNombre());
        r.setEmail(usuario.getEmail());
        r.setTelefono(usuario.getTelefono());
        r.setIdRol(usuario.getRol() != null ? usuario.getRol().getIdRol() : 0);
        return r;
    }
}
