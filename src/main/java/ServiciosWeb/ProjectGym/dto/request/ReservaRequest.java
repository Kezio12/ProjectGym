package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservaRequest {
    private LocalDate fechaReserva;
    private int idUsuario;
    private int idClase;
    private String estado;
}
