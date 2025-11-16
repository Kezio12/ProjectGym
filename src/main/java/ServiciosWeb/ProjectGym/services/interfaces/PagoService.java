package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.PagoRequest;
import ServiciosWeb.ProjectGym.dto.response.PagoResponse;

import java.util.List;

public interface PagoService {

    PagoResponse crearPago(PagoRequest request);

    PagoResponse obtenerPagoPorId(int idPago);

    List<PagoResponse> listarPagos();

    PagoResponse actualizarPago(int idPago, PagoRequest request);  // ← "actualizarPago"

    void eliminarPago(int idPago);
}
