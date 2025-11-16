package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "Horario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idHorario;

    private String dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    @OneToMany(mappedBy = "horario")
    private List<Clase> clases;
}
