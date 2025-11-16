package ServiciosWeb.ProjectGym.services.interfaces;

import ServiciosWeb.ProjectGym.dto.request.UsuarioRequest;
import ServiciosWeb.ProjectGym.dto.response.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crearUsuario(UsuarioRequest request);

    UsuarioResponse obtenerUsuarioPorId(int idUsuario);

    List<UsuarioResponse> listarUsuarios();

    UsuarioResponse actualizarUsuario(int idUsuario, UsuarioRequest request);

    void eliminarUsuario(int idUsuario);
}
