package ServiciosWeb.ProjectGym.repositories;

import ServiciosWeb.ProjectGym.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Buscar usuario por email (puede no existir, por eso Optional)
    Optional<Usuario> findByEmail(String email);

    // Verificar si existe un usuario con ese email (más eficiente para validaciones)
    boolean existsByEmail(String email);
}
