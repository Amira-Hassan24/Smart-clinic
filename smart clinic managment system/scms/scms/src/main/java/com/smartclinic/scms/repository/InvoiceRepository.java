package com.smartclinic.scms.repository;

import com.smartclinic.scms.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Invoice findByAppointmentId(Long appointmentId);
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.createdAt >= :start AND i.createdAt <= :end AND i.paymentStatus = 'PAID'")
    Double getTotalRevenueInPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    long countByPaymentStatus(String status);
}