package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.*;
import com.smartclinic.scms.repository.*;
import com.smartclinic.scms.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*") //
public class ReceptionistController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentService appointmentService;


    @PostMapping("/patients")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
        patient.setRole(Role.PATIENT);
        return ResponseEntity.ok(patientRepository.save(patient));
    }


    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }


    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }


    @GetMapping("/doctor/{doctorId}/available-slots-7days")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlotsNext7Days(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getSlotsForNext7Days(doctorId));
    }


    @GetMapping("/doctor/{doctorId}/today")
    public ResponseEntity<List<Appointment>> getTodayAppointments(@PathVariable Long doctorId) {
        LocalDate today = LocalDate.now();
        List<Appointment> todayApps = appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(app -> app.getAppointmentDate().toLocalDate().equals(today))
                .toList();
        return ResponseEntity.ok(todayApps);
    }
}