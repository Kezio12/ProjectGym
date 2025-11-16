package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.RolRequest;
import ServiciosWeb.ProjectGym.dto.response.RolResponse;
import ServiciosWeb.ProjectGym.services.interfaces.RolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PostMapping
    public ResponseEntity<RolResponse> crear(@RequestBody RolRequest request) {
        return ResponseEntity.ok(rolService.crearRol(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(rolService.obtenerRolPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<RolResponse>> listar() {
        return ResponseEntity.ok(rolService.listarRoles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolResponse> actualizar(
            @PathVariable int id,
            @RequestBody RolRequest request
    ) {
        return ResponseEntity.ok(rolService.actualizarRol(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        rolService.eliminarRol(id);
        return ResponseEntity.noContent().build();
    }
}
