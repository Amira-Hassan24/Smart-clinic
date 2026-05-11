package com.smartclinic.scms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileResponse {
    private String fullName;
    private String phoneNumber;
    private String gender;
    private LocalDate birthDate;
    private String address;
    private String email;
}