package ServiciosWeb.ProjectGym.services.impl;

import ServiciosWeb.ProjectGym.dto.request.PagoRequest;
import ServiciosWeb.ProjectGym.dto.response.PagoResponse;
import ServiciosWeb.ProjectGym.entities.Membresia;
import ServiciosWeb.ProjectGym.entities.Pago;
import ServiciosWeb.ProjectGym.exceptions.ResourceNotFoundException;
import ServiciosWeb.ProjectGym.repositories.MembresiaRepository;
import ServiciosWeb.ProjectGym.repositories.PagoRepository;
import ServiciosWeb.ProjectGym.services.interfaces.PagoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;
    private final MembresiaRepository membresiaRepository;

    public PagoServiceImpl(PagoRepository pagoRepository,
                           MembresiaRepository membresiaRepository) {
        this.pagoRepository = pagoRepository;
        this.membresiaRepository = membresiaRepository;
    }

    @Override
    public PagoResponse crearPago(PagoRequest request) {

        Membresia membresia = membresiaRepository.findById(request.getIdMembresia())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Membresía no encontrada con id: " + request.getIdMembresia()
                ));

        Pago p = new Pago();
        p.setFecha(request.getFecha());
        p.setMonto(request.getMonto());
        p.setMembresia(membresia);

        Pago guardado = pagoRepository.save(p);
        return mapToResponse(guardado);
    }

    @Override
    public PagoResponse actualizarPago(Integer idPago, PagoRequest request) { //CAMBIADO: int → Integer
        Pago p = pagoRepository.findById(idPago)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pago no encontrado con id: " + idPago
                ));

        if (request.getFecha() != null) {
            p.setFecha(request.getFecha());
        }
        if (request.getMonto() != null) {
            p.setMonto(request.getMonto());
        }
        if (request.getIdMembresia() != null) {
            Membresia membresia = membresiaRepository.findById(request.getIdMembresia())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Membresía no encontrada con id: " + request.getIdMembresia()
                    ));
            p.setMembresia(membresia);
        }

        Pago actualizado = pagoRepository.save(p);
        return mapToResponse(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponse obtenerPagoPorId(Integer idPago) { //CAMBIADO: int → Integer
        Pago p = pagoRepository.findById(idPago)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pago no encontrado con id: " + idPago
                ));
        return mapToResponse(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listarPagos() {
        return pagoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarPago(Integer idPago) { //CAMBIADO: int → Integer
        Pago p = pagoRepository.findById(idPago)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pago no encontrado con id: " + idPago
                ));
        pagoRepository.delete(p);
    }

    /* ---- Helper ---- */

    private PagoResponse mapToResponse(Pago p) {
        PagoResponse r = new PagoResponse();
        r.setIdPago(p.getIdPago());
        r.setFecha(p.getFecha());
        r.setMonto(p.getMonto());
        r.setIdMembresia(p.getMembresia().getIdMembresia());
        return r;
    }
}