package com.OOAD.payment_backend.payment_backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String cardNumber;
    private String cardHolderName;
    private String cardType;
    private String expirationDate;
    private boolean isPreferred;
}
