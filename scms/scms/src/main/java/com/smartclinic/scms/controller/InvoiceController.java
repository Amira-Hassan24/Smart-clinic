package com.smartclinic.scms.controller;

import com.smartclinic.scms.entity.Invoice;
import com.smartclinic.scms.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/generate/{appointmentId}")
    public ResponseEntity<Invoice> generateInvoice(@PathVariable Long appointmentId, @RequestParam Double price) {
        return ResponseEntity.ok(appointmentService.createInvoice(appointmentId, price));
    }
}