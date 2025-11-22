package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.EntrenadorRequest;
import ServiciosWeb.ProjectGym.dto.response.EntrenadorResponse;
import ServiciosWeb.ProjectGym.services.interfaces.EntrenadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entrenadores")
public class EntrenadorController {

    private final EntrenadorService entrenadorService;

    public EntrenadorController(EntrenadorService entrenadorService) {
        this.entrenadorService = entrenadorService;
    }

    @PostMapping
    public ResponseEntity<EntrenadorResponse> crear(@RequestBody EntrenadorRequest request) {
        return ResponseEntity.ok(entrenadorService.crearEntrenador(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrenadorResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(entrenadorService.obtenerEntrenadorPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<EntrenadorResponse>> listar() {
        return ResponseEntity.ok(entrenadorService.listarEntrenadores());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrenadorResponse> actualizar(
            @PathVariable int id,
            @RequestBody EntrenadorRequest request
    ) {
        return ResponseEntity.ok(entrenadorService.actualizarEntrenador(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        entrenadorService.eliminarEntrenador(id);
        return ResponseEntity.noContent().build();
    }
}
