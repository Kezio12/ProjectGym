package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.ReservaRequest;
import ServiciosWeb.ProjectGym.dto.response.ReservaResponse;
import ServiciosWeb.ProjectGym.services.interfaces.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> crear(@RequestBody ReservaRequest request) {
        return ResponseEntity.ok(reservaService.crearReserva(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(reservaService.obtenerReservaPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> listar() {
        return ResponseEntity.ok(reservaService.listarReservas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.noContent().build();
    }
}
