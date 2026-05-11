package com.smartclinic.scms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.smartclinic.scms.dto.DoctorRequest;
import com.smartclinic.scms.repository.ClinicRepository;
import com.smartclinic.scms.repository.DoctorRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Entity
@Table(name = "doctors")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Doctor extends User {

    private String specialization;

    private Integer consultationDuration;

    private String specialty;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<DoctorSchedule> schedules;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Prescription> prescriptions;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments;

    @OneToOne
    @JoinColumn(name = "assistant_id")
    private User assistant;


    @ManyToOne
    @JoinColumn(name = "clinic_id")
    @JsonIgnoreProperties({"doctors"})
    private Clinic clinic;

}