package com.smartclinic.scms.service;

import com.smartclinic.scms.entity.*;
import com.smartclinic.scms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        String dayName = date.getDayOfWeek().name();

        DoctorSchedule schedule = doctor.getSchedules().stream()
                .filter(s -> s.getDayOfWeek().equalsIgnoreCase(dayName))
                .findFirst()
                .orElse(null);

        if (schedule == null) return new ArrayList<>();

        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = LocalTime.parse(schedule.getStartTime());
        LocalTime end = LocalTime.parse(schedule.getEndTime());
        int duration = (doctor.getConsultationDuration() != null) ? doctor.getConsultationDuration() : 30;

        while (current.plusMinutes(duration).isBefore(end) || current.plusMinutes(duration).equals(end)) {
            LocalDateTime slotDateTime = LocalDateTime.of(date, current);
            if (!appointmentRepository.existsByDoctorIdAndAppointmentDate(doctorId, slotDateTime)) {
                slots.add(current);
            }
            current = current.plusMinutes(duration);
        }
        return slots;
    }

    public List<LocalDateTime> getSlotsForNext7Days(Long doctorId) {
        List<LocalDateTime> freeSlots = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 7; i++) {
            LocalDate targetDate = today.plusDays(i);
            List<LocalTime> times = getAvailableSlots(doctorId, targetDate);
            for (LocalTime t : times) {
                freeSlots.add(LocalDateTime.of(targetDate, t));
            }
        }
        return freeSlots;
    }

    public Map<String, Long> getDoctorStats(Long doctorId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) appointmentRepository.findByDoctorId(doctorId).size());
        stats.put("pending", appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.Pending));
        stats.put("arrived", appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.Arrived));
        stats.put("completed", appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.Completed));
        return stats;
    }

    public Appointment bookAppointment(Appointment appointment) {
        if (Boolean.TRUE.equals(appointment.getIsPriority())) {
            appointment.setStatus(AppointmentStatus.Confirmed);
            return appointmentRepository.save(appointment);
        }
        if (appointmentRepository.existsByDoctorIdAndAppointmentDate(appointment.getDoctor().getId(), appointment.getAppointmentDate())) {
            throw new RuntimeException("Slot already booked!");
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment app = appointmentRepository.findById(id).orElseThrow();
        app.setStatus(status);
        return appointmentRepository.save(app);
    }

    public Invoice createInvoice(Long appointmentId, Double price) {
        Appointment app = appointmentRepository.findById(appointmentId).orElseThrow();
        Invoice invoice = new Invoice();
        invoice.setAppointment(app);
        invoice.setAmount(price);
        invoice.setPaymentStatus("PAID");
        return invoiceRepository.save(invoice);
    }

    public Map<String, Object> getClinicDashboardStats() {
        Map<String, Object> dashboard = new HashMap<>();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        dashboard.put("todayAppointments", appointmentRepository.countAppointmentsInPeriod(null, startOfDay, endOfDay));
        dashboard.put("todayRevenue", invoiceRepository.getTotalRevenueInPeriod(startOfDay, endOfDay));
        dashboard.put("totalPatients", patientRepository.count());
        dashboard.put("pendingPayments", invoiceRepository.countByPaymentStatus("UNPAID"));

        return dashboard;
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
}