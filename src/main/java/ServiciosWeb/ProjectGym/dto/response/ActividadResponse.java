package ServiciosWeb.ProjectGym.dto.response;

import lombok.Data;

@Data
public class ActividadResponse {
    private int idActividad;
    private String nombre;
    private String descripcion;
    private Integer duracion;
    private Integer capacidadMaxima;
}
