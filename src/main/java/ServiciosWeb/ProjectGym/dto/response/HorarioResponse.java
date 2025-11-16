package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalTime;

@Data
public class HorarioResponse {
    private int idHorario;
    private String dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
