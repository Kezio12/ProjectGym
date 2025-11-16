package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Clase")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idClase;

    private LocalDateTime fechaHora;
    private int cupoMaximo;

    // Relaciones obligatorias
    @ManyToOne
    @JoinColumn(name = "idActividad", nullable = false)
    private Actividad actividad;

    @ManyToOne
    @JoinColumn(name = "idEntrenador", nullable = false)
    private Entrenador entrenador;

    // Relación opcional con Horario
    @ManyToOne
    @JoinColumn(name = "idHorario", nullable = true)
    private Horario horario;

    // Reservas de la clase
    @OneToMany(mappedBy = "clase")
    private List<Reserva> reservas;
}
