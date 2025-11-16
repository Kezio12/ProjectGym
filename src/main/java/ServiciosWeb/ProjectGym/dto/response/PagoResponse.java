package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PagoResponse {
    private int idPago;
    private LocalDate fecha;
    private double monto;
    private int idMembresia;
}
