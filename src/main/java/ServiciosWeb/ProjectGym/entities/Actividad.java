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
    @Column(name = "id_actividad")
    private int idActividad;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "duration")
    private Integer duracion;

    @Column(name = "capacidad_maxima")
    private Integer capacidadMaxima;

    @OneToMany(mappedBy = "actividad")
    private List<Clase> clases;
}