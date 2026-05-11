package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.Prescription;
import com.smartclinic.scms.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping("/add/{appointmentId}")
    public ResponseEntity<Prescription> add(@PathVariable Long appointmentId,
                                            @RequestParam String diagnosis,
                                            @RequestParam String medicines) {
        return ResponseEntity.ok(prescriptionService.addPrescription(appointmentId, diagnosis, medicines));
    }
}