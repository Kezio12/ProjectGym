package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Actividad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idActividad;

    private String nombre;
    private String descripcion;

    @OneToMany(mappedBy = "actividad")
    private List<Clase> clases;
}
