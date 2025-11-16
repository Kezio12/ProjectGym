package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;

@Data
public class UsuarioResponse {
    private int idUsuario;
    private String nombre;
    private String email;
    private String telefono;
    private int idRol;
}
