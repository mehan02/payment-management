package com.OOAD.payment_backend.payment_backend;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<PaymentMethod> getPaymentMethodsByUserId(String userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public PaymentMethod savePaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(Long id, PaymentMethod paymentMethod) {
        Optional<PaymentMethod> existingPaymentMethod = paymentMethodRepository.findById(id);
        if (existingPaymentMethod.isPresent()) {
            PaymentMethod updatedPaymentMethod = existingPaymentMethod.get();
            updatedPaymentMethod.setCardNumber(paymentMethod.getCardNumber());
            updatedPaymentMethod.setCardHolderName(paymentMethod.getCardHolderName());
            updatedPaymentMethod.setExpirationDate(paymentMethod.getExpirationDate());
            updatedPaymentMethod.setCardType(paymentMethod.getCardType());
            return paymentMethodRepository.save(updatedPaymentMethod);
        }
        return null;
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }

    public void setPreferredPaymentMethod(String userId, Long id) {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByUserId(userId);
        for (PaymentMethod paymentMethod : paymentMethods) {
            if (paymentMethod.getId().equals(id)) {
                paymentMethod.setPreferred(true);
            } else {
                paymentMethod.setPreferred(false);
            }
            paymentMethodRepository.save(paymentMethod);
        }
    }
}
