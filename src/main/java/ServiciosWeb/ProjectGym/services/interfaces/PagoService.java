package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.PagoRequest;
import ServiciosWeb.ProjectGym.dto.response.PagoResponse;

import java.util.List;

public interface PagoService {

    PagoResponse crearPago(PagoRequest request);
    PagoResponse obtenerPagoPorId(Integer idPago); // ✅ Cambiar int → Integer
    List<PagoResponse> listarPagos();
    PagoResponse actualizarPago(Integer idPago, PagoRequest request); // ✅ Cambiar int → Integer
    void eliminarPago(Integer idPago); // ✅ Cambiar int → Integer
}