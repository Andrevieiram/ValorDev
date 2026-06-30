package com.valordev.api.proposals;

import com.valordev.api.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "clients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(name = "client_type", nullable = false, length = 20)
    private String clientType;

    @Column(name = "digital_experience", nullable = false, length = 20)
    private String digitalExperience;

    @Column(name = "recurring_client", nullable = false, length = 20)
    private String recurringClient;

    @Column(nullable = false, length = 20)
    private String location;

    @Column(name = "business_impact", nullable = false, length = 20)
    private String businessImpact;
}
