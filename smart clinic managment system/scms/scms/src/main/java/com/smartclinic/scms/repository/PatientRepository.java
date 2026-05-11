package com.smartclinic.scms.repository;

import com.smartclinic.scms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByPhoneNumber(String phoneNumber);
}