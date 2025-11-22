package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.MembresiaRequest;
import ServiciosWeb.ProjectGym.dto.response.MembresiaResponse;

import java.util.List;

public interface MembresiaService {

    MembresiaResponse crearMembresia(MembresiaRequest request);

    MembresiaResponse obtenerMembresiaPorId(Integer idMembresia); // ✅ CAMBIAR: int → Integer

    List<MembresiaResponse> listarMembresias();

    MembresiaResponse actualizarMembresia(Integer idMembresia, MembresiaRequest request); // ✅ CAMBIAR: int → Integer

    void eliminarMembresia(Integer idMembresia); // ✅ CAMBIAR: int → Integer
}