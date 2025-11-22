package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.ReservaRequest;
import ServiciosWeb.ProjectGym.dto.response.ReservaResponse;

import java.util.List;

public interface ReservaService {

    ReservaResponse crearReserva(ReservaRequest request);

    ReservaResponse obtenerReservaPorId(int idReserva);

    List<ReservaResponse> listarReservas();

    void eliminarReserva(int idReserva);

    List<ReservaResponse> obtenerReservasPorUsuario(int usuarioId);
}
