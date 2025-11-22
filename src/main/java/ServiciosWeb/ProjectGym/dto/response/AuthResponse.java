package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String nombre;
    private int idUsuario;
    private String rol;

    public AuthResponse(String token, String email, String nombre, int idUsuario, String rol) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
        this.idUsuario = idUsuario;
        this.rol = rol;
    }
}