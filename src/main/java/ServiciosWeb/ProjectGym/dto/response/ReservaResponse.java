package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservaResponse {
    private int idReserva;
    private LocalDate fechaReserva;
    private int idUsuario;
    private int idClase;
}
