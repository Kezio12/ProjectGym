package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String nombre;
    private String email;
    private String telefono;
    private String password; // Opcional - solo si quiere cambiar
}