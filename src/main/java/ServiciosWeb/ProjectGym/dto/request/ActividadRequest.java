package ServiciosWeb.ProjectGym.dto.request;

import lombok.Data;

@Data
public class ActividadRequest {
    private String nombre;
    private String descripcion;
    private Integer duracion;
    private Integer capacidadMaxima;
}
