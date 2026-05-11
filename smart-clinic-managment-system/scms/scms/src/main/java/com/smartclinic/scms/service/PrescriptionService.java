package com.smartclinic.scms.service;

import com.smartclinic.scms.entity.Appointment;
import com.smartclinic.scms.entity.AppointmentStatus;
import com.smartclinic.scms.entity.Prescription;
import com.smartclinic.scms.repository.AppointmentRepository;
import com.smartclinic.scms.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Prescription addPrescription(Long appointmentId, String diagnosis, String medicines) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDiagnosis(diagnosis);
        prescription.setMedicines(medicines);
        appointment.setStatus(AppointmentStatus.Completed);
        appointmentRepository.save(appointment);

        return prescriptionRepository.save(prescription);
    }
}