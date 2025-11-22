package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.config.JwtUtil;
import ServiciosWeb.ProjectGym.dto.request.UsuarioRequest;
import ServiciosWeb.ProjectGym.dto.response.UsuarioResponse;
import ServiciosWeb.ProjectGym.entities.Usuario;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.UsuarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.crearUsuario(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtener(@PathVariable int id) {
        return ResponseEntity.ok(usuarioService.obtenerUsuarioPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String token) {

        System.out.println("🔐 DEBUG - Token recibido: " + token);

        if (token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
            System.out.println("❌ ERROR - Token inválido o faltante");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String cleanToken = token.replace("Bearer ", "").trim();
            System.out.println("📧 Extrayendo email del token...");

            String email = jwtUtil.extractEmail(cleanToken);
            System.out.println("✅ Email extraído: " + email);

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            System.out.println("✅ Usuario encontrado: " + usuario.getNombre());

            UsuarioResponse response = new UsuarioResponse();
            response.setIdUsuario(usuario.getIdUsuario());
            response.setNombre(usuario.getNombre());
            response.setEmail(usuario.getEmail());
            response.setTelefono(usuario.getTelefono());
            response.setIdRol(usuario.getRol().getIdRol());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error en getCurrentUser: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable int id,
            @RequestBody UsuarioRequest request
    ) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
