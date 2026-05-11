package com.smartclinic.scms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Data
public class UserProfile {
    @Id
    private Long id;

    private String fullName;
    private String phoneNumber;
    private String gender;
    private LocalDate birthDate;
    private String address;


    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("profile")
    private User user;
}