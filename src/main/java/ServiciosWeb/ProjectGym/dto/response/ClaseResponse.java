package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClaseResponse {
    private int idClase;
    private LocalDateTime fechaHora;
    private int cupoMaximo;
    private int cuposDisponibles;
    private int idActividad;
    private int idEntrenador;
    private Integer idHorario;
}
