package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.ActividadRequest;
import ServiciosWeb.ProjectGym.dto.response.ActividadResponse;
import ServiciosWeb.ProjectGym.entities.Actividad;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.ActividadRepository;
import ServiciosWeb.ProjectGym.services.interfaces.ActividadService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActividadServiceImpl implements ActividadService {

    private final ActividadRepository actividadRepository;

    public ActividadServiceImpl(ActividadRepository actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    @Override
    public ActividadResponse crearActividad(ActividadRequest request) {
        Actividad a = new Actividad();
        a.setNombre(request.getNombre());
        a.setDescripcion(request.getDescripcion());
        a.setDuracion(request.getDuracion()); // ← FALTABA
        a.setCapacidadMaxima(request.getCapacidadMaxima()); // ← FALTABA

        Actividad guardada = actividadRepository.save(a);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public ActividadResponse obtenerActividadPorId(int idActividad) {
        Actividad a = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Actividad no encontrada con id: " + idActividad
                ));
        return mapToResponse(a);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActividadResponse> listarActividades() {
        return actividadRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ActividadResponse actualizarActividad(int idActividad, ActividadRequest request) {
        Actividad a = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Actividad no encontrada con id: " + idActividad
                ));

        if (request.getNombre() != null) a.setNombre(request.getNombre());
        if (request.getDescripcion() != null) a.setDescripcion(request.getDescripcion());
        if (request.getDuracion() != null) a.setDuracion(request.getDuracion());
        if (request.getCapacidadMaxima() != null) a.setCapacidadMaxima(request.getCapacidadMaxima());

        Actividad actualizada = actividadRepository.save(a);
        return mapToResponse(actualizada);
    }

    @Override
    public void eliminarActividad(int idActividad) {
        Actividad a = actividadRepository.findById(idActividad)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Actividad no encontrada con id: " + idActividad
                ));
        actividadRepository.delete(a);
    }

    /* ---- Helper ---- */

    private ActividadResponse mapToResponse(Actividad a) {
        ActividadResponse r = new ActividadResponse();
        r.setIdActividad(a.getIdActividad());
        r.setNombre(a.getNombre());
        r.setDescripcion(a.getDescripcion());
        r.setDuracion(a.getDuracion());
        r.setCapacidadMaxima(a.getCapacidadMaxima());
        return r;
    }
}