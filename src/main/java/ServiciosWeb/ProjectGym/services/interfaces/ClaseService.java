package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.ClaseRequest;
import ServiciosWeb.ProjectGym.dto.response.ClaseResponse;

import java.util.List;

public interface ClaseService {

    ClaseResponse crearClase(ClaseRequest request);

    ClaseResponse obtenerClasePorId(int idClase);

    List<ClaseResponse> listarClases();

    ClaseResponse actualizarClase(int idClase, ClaseRequest request);

    void eliminarClase(int idClase);
}
