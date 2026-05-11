package com.smartclinic.scms.repository;

import com.smartclinic.scms.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
}