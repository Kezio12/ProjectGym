package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.MembresiaRequest;
import ServiciosWeb.ProjectGym.dto.response.MembresiaResponse;

import java.util.List;

public interface MembresiaService {

    MembresiaResponse crearMembresia(MembresiaRequest request);

    MembresiaResponse obtenerMembresiaPorId(int idMembresia);

    List<MembresiaResponse> listarMembresias();

    MembresiaResponse actualizarMembresia(int idMembresia, MembresiaRequest request);

    void eliminarMembresia(int idMembresia);
}
