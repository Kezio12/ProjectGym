package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.AsistenciaRequest;
import ServiciosWeb.ProjectGym.dto.response.AsistenciaResponse;
import ServiciosWeb.ProjectGym.services.interfaces.AsistenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencias")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @PostMapping
    public ResponseEntity<AsistenciaResponse> registrar(@RequestBody AsistenciaRequest request) {
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(asistenciaService.obtenerAsistenciaPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<AsistenciaResponse>> listar() {
        return ResponseEntity.ok(asistenciaService.listarAsistencias());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        asistenciaService.eliminarAsistencia(id);
        return ResponseEntity.noContent().build();
    }
}