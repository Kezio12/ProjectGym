package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.ActividadRequest;
import ServiciosWeb.ProjectGym.dto.response.ActividadResponse;
import ServiciosWeb.ProjectGym.services.interfaces.ActividadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @PostMapping
    public ResponseEntity<ActividadResponse> crear(@RequestBody ActividadRequest request) {
        return ResponseEntity.ok(actividadService.crearActividad(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(actividadService.obtenerActividadPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ActividadResponse>> listar() {
        return ResponseEntity.ok(actividadService.listarActividades());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> actualizar(
            @PathVariable int id,
            @RequestBody ActividadRequest request
    ) {
        return ResponseEntity.ok(actividadService.actualizarActividad(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        actividadService.eliminarActividad(id);
        return ResponseEntity.noContent().build();
    }
}
