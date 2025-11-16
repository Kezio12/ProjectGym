package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class HorarioRequest {
    private String dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
