package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MembresiaResponse {
    private int idMembresia;
    private String tipo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private int idUsuario;
}
