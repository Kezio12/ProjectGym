package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClaseRequest {
    private LocalDateTime fechaHora;
    private Integer cupoMaximo;
    private Integer idActividad;
    private Integer idEntrenador;
    private Integer idHorario;   // puede ser null (opcional)
}
