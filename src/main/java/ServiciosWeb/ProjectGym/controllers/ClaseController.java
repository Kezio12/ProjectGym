package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.ClaseRequest;
import ServiciosWeb.ProjectGym.dto.response.ClaseResponse;
import ServiciosWeb.ProjectGym.services.interfaces.ClaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clases")
public class ClaseController {

    private final ClaseService claseService;

    public ClaseController(ClaseService claseService) {
        this.claseService = claseService;
    }

    @PostMapping
    public ResponseEntity<ClaseResponse> crear(@RequestBody ClaseRequest request) {
        return ResponseEntity.ok(claseService.crearClase(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaseResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(claseService.obtenerClasePorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ClaseResponse>> listar() {
        return ResponseEntity.ok(claseService.listarClases());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClaseResponse> actualizar(
            @PathVariable int id,
            @RequestBody ClaseRequest request
    ) {
        return ResponseEntity.ok(claseService.actualizarClase(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        claseService.eliminarClase(id);
        return ResponseEntity.noContent().build();
    }
}
