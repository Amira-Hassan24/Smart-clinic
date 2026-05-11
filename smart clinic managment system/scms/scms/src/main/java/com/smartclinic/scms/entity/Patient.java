package com.smartclinic.scms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@EqualsAndHashCode(callSuper = true)
public class Patient extends User {

    private String bloodType;
    private String emergencyContact;

    @OneToMany(mappedBy = "patient")
    @JsonIgnoreProperties("patient")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("patient")
    private List<Prescription> prescriptions;

    private String medicalHistory;

}
