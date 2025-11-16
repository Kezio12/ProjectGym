package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.HorarioRequest;
import ServiciosWeb.ProjectGym.dto.response.HorarioResponse;
import ServiciosWeb.ProjectGym.services.interfaces.HorarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @PostMapping
    public ResponseEntity<HorarioResponse> crear(@RequestBody HorarioRequest request) {
        return ResponseEntity.ok(horarioService.crearHorario(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(horarioService.obtenerHorarioPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<HorarioResponse>> listar() {
        return ResponseEntity.ok(horarioService.listarHorarios());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioResponse> actualizar(
            @PathVariable int id,
            @RequestBody HorarioRequest request
    ) {
        return ResponseEntity.ok(horarioService.actualizarHorario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        horarioService.eliminarHorario(id);
        return ResponseEntity.noContent().build();
    }
}
