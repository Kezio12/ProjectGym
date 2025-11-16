package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Entrenador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Entrenador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEntrenador;

    private String nombre;
    private String especialidad;

    @OneToMany(mappedBy = "entrenador")
    private List<Clase> clases;
}
