package ServiciosWeb.ProjectGym.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ServiciosWeb.ProjectGym.entities.Membresia;

public interface MembresiaRepository extends JpaRepository<Membresia, Integer> {

    @Query("SELECT COUNT(m) FROM Membresia m WHERE m.fechaFin >= CURRENT_DATE")
    Long countActiveMemberships();
}