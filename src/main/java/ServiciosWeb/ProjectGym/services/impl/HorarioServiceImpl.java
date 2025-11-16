package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.HorarioRequest;
import ServiciosWeb.ProjectGym.dto.response.HorarioResponse;
import ServiciosWeb.ProjectGym.entities.Horario;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.HorarioRepository;
import ServiciosWeb.ProjectGym.services.interfaces.HorarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HorarioServiceImpl implements HorarioService {

    private final HorarioRepository horarioRepository;

    public HorarioServiceImpl(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @Override
    public HorarioResponse crearHorario(HorarioRequest request) {
        Horario h = new Horario();
        h.setDia(request.getDia());
        h.setHoraInicio(request.getHoraInicio());
        h.setHoraFin(request.getHoraFin());

        Horario guardado = horarioRepository.save(h);
        return mapToResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public HorarioResponse obtenerHorarioPorId(int idHorario) {
        Horario h = horarioRepository.findById(idHorario)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
        return mapToResponse(h);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioResponse> listarHorarios() {
        return horarioRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HorarioResponse actualizarHorario(int idHorario, HorarioRequest request) {
        Horario h = horarioRepository.findById(idHorario)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));

        if (request.getDia() != null) h.setDia(request.getDia());
        if (request.getHoraInicio() != null) h.setHoraInicio(request.getHoraInicio());
        if (request.getHoraFin() != null) h.setHoraFin(request.getHoraFin());

        return mapToResponse(horarioRepository.save(h));
    }

    @Override
    public void eliminarHorario(int idHorario) {
        Horario h = horarioRepository.findById(idHorario)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));
        horarioRepository.delete(h);
    }

    private HorarioResponse mapToResponse(Horario h) {
        HorarioResponse r = new HorarioResponse();
        r.setIdHorario(h.getIdHorario());
        r.setDia(h.getDia());
        r.setHoraInicio(h.getHoraInicio());
        r.setHoraFin(h.getHoraFin());
        return r;
    }
}
