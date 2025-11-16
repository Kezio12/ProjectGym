package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.EntrenadorRequest;
import ServiciosWeb.ProjectGym.dto.response.EntrenadorResponse;
import ServiciosWeb.ProjectGym.entities.Entrenador;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.EntrenadorRepository;
import ServiciosWeb.ProjectGym.services.interfaces.EntrenadorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EntrenadorServiceImpl implements EntrenadorService {

    private final EntrenadorRepository entrenadorRepository;

    public EntrenadorServiceImpl(EntrenadorRepository entrenadorRepository) {
        this.entrenadorRepository = entrenadorRepository;
    }

    @Override
    public EntrenadorResponse crearEntrenador(EntrenadorRequest request) {

        Entrenador e = new Entrenador();
        e.setNombre(request.getNombre());
        e.setEspecialidad(request.getEspecialidad());

        Entrenador guardado = entrenadorRepository.save(e);
        return mapToResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public EntrenadorResponse obtenerEntrenadorPorId(int idEntrenador) {
        Entrenador e = entrenadorRepository.findById(idEntrenador)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entrenador no encontrado con id: " + idEntrenador
                ));
        return mapToResponse(e);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EntrenadorResponse> listarEntrenadores() {
        return entrenadorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EntrenadorResponse actualizarEntrenador(int idEntrenador, EntrenadorRequest request) {
        Entrenador e = entrenadorRepository.findById(idEntrenador)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entrenador no encontrado con id: " + idEntrenador
                ));

        if (request.getNombre() != null) e.setNombre(request.getNombre());
        if (request.getEspecialidad() != null) e.setEspecialidad(request.getEspecialidad());

        Entrenador actualizado = entrenadorRepository.save(e);
        return mapToResponse(actualizado);
    }

    @Override
    public void eliminarEntrenador(int idEntrenador) {
        Entrenador e = entrenadorRepository.findById(idEntrenador)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entrenador no encontrado con id: " + idEntrenador
                ));
        entrenadorRepository.delete(e);
    }

    /* ---- Helper ---- */

    private EntrenadorResponse mapToResponse(Entrenador e) {
        EntrenadorResponse r = new EntrenadorResponse();
        r.setIdEntrenador(e.getIdEntrenador());
        r.setNombre(e.getNombre());
        r.setEspecialidad(e.getEspecialidad());
        return r;
    }
}
