package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AsistenciaResponse {
    private int idAsistencia;
    private LocalDate fecha;
    private boolean presente;
    private int idReserva;
}
