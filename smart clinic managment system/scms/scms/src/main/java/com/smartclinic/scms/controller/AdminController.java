package com.smartclinic.scms.controller;

import com.smartclinic.scms.dto.DoctorRequest;
import com.smartclinic.scms.entity.*;
import com.smartclinic.scms.repository.*;
import com.smartclinic.scms.service.AppointmentService;
import com.smartclinic.scms.service.DoctorService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    
    @Autowired
    private DoctorService doctorService;

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> addDoctor(@RequestBody DoctorRequest request) {
    return ResponseEntity.ok(doctorService.addDoctor(request));
}
    @PutMapping("/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setEmail(doctorDetails.getEmail());
            doctor.setIsActive(doctorDetails.getIsActive());
            return ResponseEntity.ok(doctorRepository.save(doctor));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<DoctorSchedule> updateSchedule(@PathVariable Long scheduleId, @RequestBody DoctorSchedule details) {
        return scheduleRepository.findById(scheduleId).map(s -> {
            s.setStartTime(details.getStartTime());
            s.setEndTime(details.getEndTime());
            s.setDayOfWeek(details.getDayOfWeek());
            return ResponseEntity.ok(scheduleRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/schedules")
public ResponseEntity<DoctorSchedule> addSchedule(@RequestBody DoctorSchedule schedule) {
    if (schedule.getDoctor() != null && schedule.getDoctor().getId() != null) {
        Doctor doctor = (Doctor) doctorRepository.findById(schedule.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        schedule.setDoctor(doctor);
    }
    return ResponseEntity.ok(scheduleRepository.save(schedule));
}
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/staff/admin")
    public ResponseEntity<User> addAdmin(@Valid @RequestBody User admin) {
        admin.setRole(Role.ADMIN);
        return ResponseEntity.ok(userRepository.save(admin));
    }

    @PostMapping("/staff/receptionist")
public ResponseEntity<User> addReceptionist(@Valid @RequestBody User staff, @RequestParam Long doctorId) {
    return doctorRepository.findById(doctorId).map(doctor -> {
        staff.setRole(Role.RECEPTIONIST);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        staff.setIsActive(true);
        User savedStaff = userRepository.save(staff);
        doctor.setAssistant(savedStaff);
        doctorRepository.save(doctor);
        return ResponseEntity.ok(savedStaff);
    }).orElse(ResponseEntity.notFound().build());
}

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setIsActive(!user.getIsActive());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getSystemStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(stats);
    }


    @PutMapping("/setup-profile")
    public ResponseEntity<?> setupRootAdmin(@Valid @RequestBody Map<String, String> request, Principal principal) {
        User admin = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getNeedsPasswordReset()) {
            admin.setEmail(request.get("newEmail"));
            admin.setPassword(passwordEncoder.encode(request.get("newPassword")));
            admin.setNeedsPasswordReset(false);
            userRepository.save(admin);
            return ResponseEntity.ok("Admin profile updated successfully!");
        }
        return ResponseEntity.badRequest().body("Setup already completed.");
    }


    @PostMapping("/create-admin")
    public ResponseEntity<?> createNewAdmin(@Valid @RequestBody User newUser) {
        newUser.setRole(Role.ADMIN);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setNeedsPasswordReset(false);
        userRepository.save(newUser);
        return ResponseEntity.ok("New Admin added successfully");
    }

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(appointmentService.getClinicDashboardStats());
    }
}