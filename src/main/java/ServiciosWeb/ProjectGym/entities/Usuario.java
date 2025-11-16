package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;

    private String nombre;

    @Column(unique = true)
    private String email;

    private String telefono;

    // Relación con Rol N:1
    @ManyToOne
    @JoinColumn(name = "idRol", nullable = false)
    private Rol rol;

    // Relación 1:1 con Membresía
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Membresia membresia;

    // Reservas del usuario
    @OneToMany(mappedBy = "usuario")
    private List<Reserva> reservas;
}
