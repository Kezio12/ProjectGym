package ServiciosWeb.ProjectGym.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ServiciosWeb.ProjectGym.entities.Asistencia;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    Long countByPresente(Boolean presente);
}