package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.MembresiaRequest;
import ServiciosWeb.ProjectGym.dto.response.MembresiaResponse;
import ServiciosWeb.ProjectGym.services.interfaces.MembresiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/membresias")
public class MembresiaController {

    private final MembresiaService membresiaService;

    public MembresiaController(MembresiaService membresiaService) {
        this.membresiaService = membresiaService;
    }

    @PostMapping
    public ResponseEntity<MembresiaResponse> crear(@RequestBody MembresiaRequest request) {
        return ResponseEntity.ok(membresiaService.crearMembresia(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembresiaResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(membresiaService.obtenerMembresiaPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<MembresiaResponse>> listar() {
        return ResponseEntity.ok(membresiaService.listarMembresias());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembresiaResponse> actualizar(
            @PathVariable int id,
            @RequestBody MembresiaRequest request
    ) {
        return ResponseEntity.ok(membresiaService.actualizarMembresia(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        membresiaService.eliminarMembresia(id);
        return ResponseEntity.noContent().build();
    }
}
