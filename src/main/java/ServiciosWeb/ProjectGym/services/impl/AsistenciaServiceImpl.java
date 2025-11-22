package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.AsistenciaRequest;
import ServiciosWeb.ProjectGym.dto.response.AsistenciaResponse;
import ServiciosWeb.ProjectGym.entities.Asistencia;
import ServiciosWeb.ProjectGym.entities.Reserva;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.AsistenciaRepository;
import ServiciosWeb.ProjectGym.repositories.ReservaRepository;
import ServiciosWeb.ProjectGym.services.interfaces.AsistenciaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final ReservaRepository reservaRepository;

    public AsistenciaServiceImpl(
            AsistenciaRepository asistenciaRepository,
            ReservaRepository reservaRepository
    ) {
        this.asistenciaRepository = asistenciaRepository;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public AsistenciaResponse registrarAsistencia(AsistenciaRequest request) {

        Reserva reserva = reservaRepository.findById(request.getIdReserva())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        Asistencia a = new Asistencia();
        a.setFecha(request.getFecha());
        a.setPresente(request.isPresente());
        a.setReserva(reserva);

        Asistencia guardada = asistenciaRepository.save(a);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public AsistenciaResponse obtenerAsistenciaPorId(int idAsistencia) {
        Asistencia a = asistenciaRepository.findById(idAsistencia)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada"));
        return mapToResponse(a);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsistenciaResponse> listarAsistencias() {
        return asistenciaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarAsistencia(int idAsistencia) {
        Asistencia a = asistenciaRepository.findById(idAsistencia)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada"));
        asistenciaRepository.delete(a);
    }

    private AsistenciaResponse mapToResponse(Asistencia a) {
        AsistenciaResponse r = new AsistenciaResponse();
        r.setIdAsistencia(a.getIdAsistencia());
        r.setFecha(a.getFecha());
        r.setPresente(a.isPresente());
        r.setIdReserva(a.getReserva().getIdReserva());
        return r;
    }
}