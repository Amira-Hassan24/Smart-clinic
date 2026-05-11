package com.smartclinic.scms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    private String phoneNumber;


    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"clinic"})
    private List<Doctor> doctors;

}