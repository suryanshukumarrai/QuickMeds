package com.quickmeds.service;

import java.math.BigDecimal;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.quickmeds.entity.Order;
import com.quickmeds.entity.OrderItem;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:suryanshura173@gmail.com}")
    private String senderEmail;

    @Value("${spring.mail.username:suryanshura173@gmail.com}")
    private String smtpUsername;

    @Value("${app.mail.fallback-to:suryanshura173@gmail.com}")
    private String fallbackRecipient;

    public void sendOrderConfirmationEmail(String to, Order order) {
        String items = order.getItems().stream()
                .map(OrderItem::getMedicine)
                .map(medicine -> medicine.getName())
                .collect(Collectors.joining(", "));

        BigDecimal total = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;

        String body = String.format(
                "Dear User,%n%n" +
                "Your order #%d has been placed successfully.%n%n" +
                "Items: %s%n" +
                "Total: Rs. %s%n%n" +
                "Your order has been placed successfully.%n%n" +
                "Thank you for choosing QuickMeds.",
                order.getId(),
                items.isBlank() ? "N/A" : items,
                total.toPlainString()
        );

        SimpleMailMessage message = new SimpleMailMessage();
        String recipient = (to == null || to.isBlank()) ? fallbackRecipient : to;
        String fromEmail = (senderEmail == null || senderEmail.isBlank()) ? smtpUsername : senderEmail;

        message.setFrom(fromEmail);
        message.setTo(recipient);
        message.setSubject("Order Confirmation - QuickMeds");
        message.setText(body);

        try {
            mailSender.send(message);
            log.info("Order confirmation email sent to {} for order {}", recipient, order.getId());
        } catch (Exception ex) {
            log.error("Email sending failed for order {} to {}", order.getId(), recipient, ex);
            throw ex;
        }
    }

    public void sendTestEmail(String to) {
        String recipient = (to == null || to.isBlank()) ? fallbackRecipient : to;
        String fromEmail = (senderEmail == null || senderEmail.isBlank()) ? smtpUsername : senderEmail;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipient);
        message.setSubject("QuickMeds Mail Test");
        message.setText("This is a test email from QuickMeds Spring Boot mail integration.");

        try {
            mailSender.send(message);
            log.info("Test email sent successfully to {}", recipient);
        } catch (Exception ex) {
            log.error("Test email failed to {}", recipient, ex);
            throw ex;
        }
    }
}
