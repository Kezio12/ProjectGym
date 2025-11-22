package ServiciosWeb.ProjectGym.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ServiciosWeb.ProjectGym.repositories.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private ClaseRepository claseRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private MembresiaRepository membresiaRepository;

    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            //SOLO usando repositories directamente
            stats.put("totalUsers", usuarioRepository.count());
            stats.put("totalActivities", actividadRepository.count());
            stats.put("totalClasses", claseRepository.count());
            stats.put("totalReservations", reservaRepository.count());
            stats.put("totalTrainers", entrenadorRepository.count());
            stats.put("totalMemberships", membresiaRepository.count());
            stats.put("totalAttendanceRecords", asistenciaRepository.count());

            // Para evitar errores se una try-catch para métodos personalizados
            try {
                Long asistenciasPresentes = asistenciaRepository.countByPresente(true);
                stats.put("attendedSessions", asistenciasPresentes != null ? asistenciasPresentes : 0L);
            } catch (Exception e) {
                stats.put("attendedSessions", 0L);
            }

            // Cálculo simple de ocupación
            long totalReservations = reservaRepository.count();
            long totalClasses = claseRepository.count();
            double occupancyRate = 0.0;

            if (totalClasses > 0 && totalReservations > 0) {
                occupancyRate = (double) totalReservations / totalClasses;
                occupancyRate = Math.min(occupancyRate * 100, 100);
            }

            stats.put("occupancyRate", Math.round(occupancyRate));

        } catch (Exception e) {
            // En caso de error, devolver valores por defecto
            stats.put("totalUsers", 0L);
            stats.put("totalActivities", 0L);
            stats.put("totalClasses", 0L);
            stats.put("totalReservations", 0L);
            stats.put("totalTrainers", 0L);
            stats.put("totalMemberships", 0L);
            stats.put("totalAttendanceRecords", 0L);
            stats.put("attendedSessions", 0L);
            stats.put("occupancyRate", 0);
        }

        return ResponseEntity.ok(stats);
    }
}