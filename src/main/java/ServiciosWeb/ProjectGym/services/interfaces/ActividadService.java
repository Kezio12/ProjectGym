package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.ActividadRequest;
import ServiciosWeb.ProjectGym.dto.response.ActividadResponse;

import java.util.List;

public interface ActividadService {

    ActividadResponse crearActividad(ActividadRequest request);

    ActividadResponse obtenerActividadPorId(int idActividad);

    List<ActividadResponse> listarActividades();

    ActividadResponse actualizarActividad(int idActividad, ActividadRequest request);

    void eliminarActividad(int idActividad);
}
