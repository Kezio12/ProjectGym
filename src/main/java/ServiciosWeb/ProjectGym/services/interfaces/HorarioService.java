package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.HorarioRequest;
import ServiciosWeb.ProjectGym.dto.response.HorarioResponse;

import java.util.List;

public interface HorarioService {

    HorarioResponse crearHorario(HorarioRequest request);

    HorarioResponse obtenerHorarioPorId(int idHorario);

    List<HorarioResponse> listarHorarios();

    HorarioResponse actualizarHorario(int idHorario, HorarioRequest request);

    void eliminarHorario(int idHorario);
}
