package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Membresia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Membresia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMembresia;

    private String tipo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    // Relación 1:1 con Usuario
    @OneToOne
    @JoinColumn(name = "idUsuario", unique = true, nullable = false)
    private Usuario usuario;

    // Pagos de la membresía
    @OneToMany(mappedBy = "membresia", cascade = CascadeType.ALL)
    private List<Pago> pagos;
}
