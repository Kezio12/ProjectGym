package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.PagoRequest;
import ServiciosWeb.ProjectGym.dto.response.PagoResponse;
import ServiciosWeb.ProjectGym.services.interfaces.PagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<PagoResponse> crear(@RequestBody PagoRequest request) {
        return ResponseEntity.ok(pagoService.crearPago(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(pagoService.obtenerPagoPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<PagoResponse>> listar() {
        return ResponseEntity.ok(pagoService.listarPagos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PagoResponse> actualizar(
            @PathVariable int id,
            @RequestBody PagoRequest request
    ) {
        return ResponseEntity.ok(pagoService.actualizarPago(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        pagoService.eliminarPago(id);
        return ResponseEntity.noContent().build();
    }
}
