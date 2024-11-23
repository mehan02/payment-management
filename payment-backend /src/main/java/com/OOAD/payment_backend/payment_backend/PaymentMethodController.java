package com.OOAD.payment_backend.payment_backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PaymentMethod>> getPaymentMethods(@PathVariable String userId) {
        List<PaymentMethod> paymentMethods = paymentMethodService.getPaymentMethodsByUserId(userId);
        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        PaymentMethod savedPaymentMethod = paymentMethodService.savePaymentMethod(paymentMethod);
        return ResponseEntity.ok(savedPaymentMethod);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updatePaymentMethod(
            @PathVariable Long id, @RequestBody PaymentMethod paymentMethod) {
        PaymentMethod updatedPaymentMethod = paymentMethodService.updatePaymentMethod(id, paymentMethod);
        return ResponseEntity.ok(updatedPaymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/set-preferred/{userId}/{id}")
    public ResponseEntity<Void> setPreferredPaymentMethod(
            @PathVariable String userId, @PathVariable Long id) {
        paymentMethodService.setPreferredPaymentMethod(userId, id);
        return ResponseEntity.noContent().build();
    }
}
