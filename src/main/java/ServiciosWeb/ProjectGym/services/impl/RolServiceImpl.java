package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.RolRequest;
import ServiciosWeb.ProjectGym.dto.response.RolResponse;
import ServiciosWeb.ProjectGym.entities.Rol;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.RolRepository;
import ServiciosWeb.ProjectGym.services.interfaces.RolService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;

    public RolServiceImpl(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public RolResponse crearRol(RolRequest request) {
        Rol r = new Rol();
        r.setNombre(request.getNombre());
        Rol guardado = rolRepository.save(r);
        return mapToResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public RolResponse obtenerRolPorId(int idRol) {
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + idRol));
        return mapToResponse(rol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolResponse> listarRoles() {
        return rolRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RolResponse actualizarRol(int idRol, RolRequest request) {
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + idRol));
        if (request.getNombre() != null) rol.setNombre(request.getNombre());
        Rol actualizado = rolRepository.save(rol);
        return mapToResponse(actualizado);
    }

    @Override
    public void eliminarRol(int idRol) {
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + idRol));
        rolRepository.delete(rol);
    }

    /* ----- Helpers ----- */

    private RolResponse mapToResponse(Rol rol) {
        RolResponse r = new RolResponse();
        r.setIdRol(rol.getIdRol());
        r.setNombre(rol.getNombre());
        return r;
    }
}
