package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombre;
    private String email;
    private String telefono;
    private String password;
    private int idRol;
}
