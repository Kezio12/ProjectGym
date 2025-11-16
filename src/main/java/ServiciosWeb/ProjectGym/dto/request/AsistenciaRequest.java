package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AsistenciaRequest {
    private LocalDate fecha;
    private boolean presente;
    private int idReserva;
}
