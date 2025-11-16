package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.AsistenciaRequest;
import ServiciosWeb.ProjectGym.dto.response.AsistenciaResponse;
import java.util.List;

public interface AsistenciaService {

    AsistenciaResponse registrarAsistencia(AsistenciaRequest request);

    AsistenciaResponse obtenerAsistenciaPorId(int idAsistencia);

    List<AsistenciaResponse> listarAsistencias();

    void eliminarAsistencia(int idAsistencia);

}
