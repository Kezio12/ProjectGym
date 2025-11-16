package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MembresiaRequest {
    private String tipo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private int idUsuario;
}
