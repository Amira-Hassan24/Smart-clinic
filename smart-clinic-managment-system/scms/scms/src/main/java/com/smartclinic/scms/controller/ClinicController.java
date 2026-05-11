package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.Clinic;
import com.smartclinic.scms.service.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
public class ClinicController {

    @Autowired
    private ClinicService clinicService;

    @PostMapping("/add")
    public ResponseEntity<Clinic> addClinic(@RequestBody Clinic clinic) {
        return ResponseEntity.ok(clinicService.addClinic(clinic));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Clinic>> getAllClinics() {
        return ResponseEntity.ok(clinicService.getAllClinics());
    }
}