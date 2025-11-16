package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PagoRequest {
    private LocalDate fecha;
    private Double monto;
    private Integer idMembresia;
}
