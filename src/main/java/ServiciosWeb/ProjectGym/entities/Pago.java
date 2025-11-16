package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPago;

    private LocalDate fecha;
    private double monto;

    // Relación N:1 con Membresia
    @ManyToOne
    @JoinColumn(name = "idMembresia", nullable = false)
    private Membresia membresia;
}
