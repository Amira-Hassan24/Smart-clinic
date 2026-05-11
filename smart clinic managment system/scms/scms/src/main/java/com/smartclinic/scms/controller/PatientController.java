package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.Appointment;
import com.smartclinic.scms.entity.Prescription;
import com.smartclinic.scms.repository.PrescriptionRepository;
import com.smartclinic.scms.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @GetMapping("/{patientId}/prescriptions")
    public ResponseEntity<List<Prescription>> getMyPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionRepository.findByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}/available-slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doctorId, date));
    }

    @GetMapping("/doctor/{doctorId}/next-7-days")
    public ResponseEntity<List<LocalDateTime>> getNext7DaysSlots(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getSlotsForNext7Days(doctorId));
    }

    @PostMapping("/appointments/book")
    public ResponseEntity<Appointment> book(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }
}