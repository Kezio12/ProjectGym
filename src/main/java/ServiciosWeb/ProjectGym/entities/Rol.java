package ServiciosWeb.ProjectGym.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Rol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRol;

    @Column(nullable = false, length = 50)
    private String nombre;

    // Un rol puede tener muchos usuarios
    @OneToMany(mappedBy = "rol")
    private List<Usuario> usuarios;
}
