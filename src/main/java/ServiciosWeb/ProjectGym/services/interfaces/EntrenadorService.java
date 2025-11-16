package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.EntrenadorRequest;
import ServiciosWeb.ProjectGym.dto.response.EntrenadorResponse;

import java.util.List;

public interface EntrenadorService {

    EntrenadorResponse crearEntrenador(EntrenadorRequest request);

    EntrenadorResponse obtenerEntrenadorPorId(int idEntrenador);

    List<EntrenadorResponse> listarEntrenadores();

    EntrenadorResponse actualizarEntrenador(int idEntrenador, EntrenadorRequest request);

    void eliminarEntrenador(int idEntrenador);
}
