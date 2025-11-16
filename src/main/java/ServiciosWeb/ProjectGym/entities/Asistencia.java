package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Asistencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAsistencia;

    private LocalDate fecha;
    private boolean presente;

    @OneToOne
    @JoinColumn(name = "idReserva", unique = true, nullable = false)
    private Reserva reserva;
}
