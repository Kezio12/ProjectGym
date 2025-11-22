package ServiciosWeb.ProjectGym.controllers;

import ServiciosWeb.ProjectGym.dto.request.AuthRequest;
import ServiciosWeb.ProjectGym.dto.response.AuthResponse;
import ServiciosWeb.ProjectGym.entities.Usuario;
import ServiciosWeb.ProjectGym.repositories.UsuarioRepository;
import ServiciosWeb.ProjectGym.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Buscar usuario por email
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(authRequest.getEmail());

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no encontrado");
            }

            Usuario usuario = usuarioOpt.get();

            // Validar que el password no sea null
            if (usuario.getPassword() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error en la configuración del usuario. Contacte al administrador.");
            }

            // Verificar password
            if (!usuario.getPassword().equals(authRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Contraseña incorrecta");
            }

            // Generar token JWT
            String token = jwtUtil.generateToken(usuario.getEmail());

            // Crear respuesta
            AuthResponse response = new AuthResponse(
                    token,
                    usuario.getEmail(),
                    usuario.getNombre(),
                    usuario.getIdUsuario(),
                    usuario.getRol().getNombre()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }
}