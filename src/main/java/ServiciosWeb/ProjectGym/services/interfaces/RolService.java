package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.RolRequest;
import ServiciosWeb.ProjectGym.dto.response.RolResponse;

import java.util.List;

public interface RolService {

    RolResponse crearRol(RolRequest request);

    RolResponse obtenerRolPorId(int idRol);

    List<RolResponse> listarRoles();

    RolResponse actualizarRol(int idRol, RolRequest request);

    void eliminarRol(int idRol);
}
