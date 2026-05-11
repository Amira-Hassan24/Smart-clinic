package com.smartclinic.scms.service;
import com.smartclinic.scms.entity.Role;
import com.smartclinic.scms.dto.DoctorRequest;
import com.smartclinic.scms.entity.Clinic;
import com.smartclinic.scms.entity.Doctor;
import com.smartclinic.scms.repository.ClinicRepository;
import com.smartclinic.scms.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    public Doctor addDoctor(DoctorRequest doctorRequest) {
    Clinic clinic = clinicRepository.findById(doctorRequest.getClinicId())
            .orElseThrow(() -> new RuntimeException("Clinic not found with id: " + doctorRequest.getClinicId()));

    Doctor doctor = new Doctor();
    doctor.setName(doctorRequest.getName());
    doctor.setEmail(doctorRequest.getEmail());
    doctor.setPassword(passwordEncoder.encode(doctorRequest.getPassword()));
    doctor.setPhoneNumber(doctorRequest.getPhoneNumber());
    doctor.setSpecialty(doctorRequest.getSpecialty());
    doctor.setSpecialization(doctorRequest.getSpecialization());
    doctor.setConsultationDuration(doctorRequest.getConsultationDuration());
    doctor.setRole(Role.DOCTOR);
    doctor.setIsActive(true);
    doctor.setClinic(clinic);

    return doctorRepository.save(doctor);
}

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }
}