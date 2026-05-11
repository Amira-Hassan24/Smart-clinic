package com.smartclinic.scms.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String resetCode;
    @NotBlank
    private String newPassword;
}