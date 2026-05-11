package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.Appointment;
import com.smartclinic.scms.entity.AppointmentStatus;
import com.smartclinic.scms.service.AppointmentService;
import com.smartclinic.scms.repository.AppointmentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/book")
    public ResponseEntity<Appointment> book(@Valid @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doctorId, date));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PutMapping("/check-in/{id}")
    public ResponseEntity<Appointment> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, AppointmentStatus.Arrived));
    }

    @PutMapping("/complete-visit/{id}")
    public ResponseEntity<Appointment> completeVisit(
            @PathVariable Long id,
            @RequestBody Appointment details) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setChiefComplaint(details.getChiefComplaint());
        appointment.setVisitNotes(details.getVisitNotes());
        appointment.setStatus(AppointmentStatus.Completed);

        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}