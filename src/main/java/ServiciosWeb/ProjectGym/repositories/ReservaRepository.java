package ServiciosWeb.ProjectGym.repositories;

import ServiciosWeb.ProjectGym.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    // Método para contar reservas por clase
    long countByClaseIdClase(int idClase);

    // Método para verificar si un usuario ya reservó una clase
    boolean existsByUsuarioIdUsuarioAndClaseIdClase(int idUsuario, int idClase);

    List<Reserva> findByUsuarioIdUsuario(int idUsuario);
}
