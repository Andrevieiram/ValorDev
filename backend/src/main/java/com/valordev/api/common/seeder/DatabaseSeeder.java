package com.valordev.api.common.seeder;

import com.valordev.api.auth.User;
import com.valordev.api.auth.UserRepository;
import com.valordev.api.proposals.Proposal;
import com.valordev.api.proposals.ProposalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProposalRepository proposalRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("[DatabaseSeeder] Iniciando verificação de sementes de dados...");

        // Tenta encontrar o usuário preferencial
        Optional<User> userOpt = userRepository.findByEmail("kevin.kennedy1991@gmail.com");
        
        // Se não encontrar, tenta obter o primeiro usuário cadastrado
        if (userOpt.isEmpty()) {
            List<User> allUsers = userRepository.findAll();
            if (!allUsers.isEmpty()) {
                userOpt = Optional.of(allUsers.get(0));
            }
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<Proposal> existingProposals = proposalRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

            // Apenas semeamos se o usuário tiver poucas propostas (para não acumular dados infinitamente a cada restart)
            if (existingProposals.size() < 4) {
                log.info("[DatabaseSeeder] Semeando propostas de simulação variadas para o usuário: {}", user.getEmail());
                
                Proposal p1 = Proposal.builder()
                        .user(user)
                        .name("Landing Page - Nutricionista")
                        .projectType("landing")
                        .complexity("low")
                        .deadline("15 dias")
                        .meetingsFrequency("weekly")
                        .scopeDocumented(true)
                        .maintenance(false)
                        .estimatedHours(20)
                        .billingMethod("fixed")
                        .paymentMethod("pix")
                        .installmentOption("oneTime")
                        .paymentTerm("immediate")
                        .downPayment("fiftyPercent")
                        .recurringBilling("no")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("1800.00"))
                        .recommendedPrice(new BigDecimal("2200.00"))
                        .premiumPrice(new BigDecimal("2800.00"))
                        .confidence((short) 95)
                        .riskScore((short) 15)
                        .riskLevel("low")
                        .probability("fechada")
                        .status("won")
                        .createdAt(LocalDateTime.now().minusDays(30))
                        .build();

                Proposal p2 = Proposal.builder()
                        .user(user)
                        .name("E-commerce - Loja de Roupas")
                        .projectType("webapp")
                        .complexity("medium")
                        .deadline("45 dias")
                        .meetingsFrequency("weekly")
                        .scopeDocumented(true)
                        .maintenance(true)
                        .estimatedHours(120)
                        .billingMethod("fixed")
                        .paymentMethod("boleto")
                        .installmentOption("threeInstallments")
                        .paymentTerm("fifteenDays")
                        .downPayment("thirtyPercent")
                        .recurringBilling("no")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("12000.00"))
                        .recommendedPrice(new BigDecimal("15000.00"))
                        .premiumPrice(new BigDecimal("18000.00"))
                        .confidence((short) 85)
                        .riskScore((short) 35)
                        .riskLevel("medium")
                        .probability("alta")
                        .status("sent")
                        .createdAt(LocalDateTime.now().minusDays(15))
                        .build();

                Proposal p3 = Proposal.builder()
                        .user(user)
                        .name("App de Delivery Local")
                        .projectType("mobile")
                        .complexity("high")
                        .deadline("90 dias")
                        .meetingsFrequency("biweekly")
                        .scopeDocumented(true)
                        .maintenance(true)
                        .estimatedHours(250)
                        .billingMethod("milestone")
                        .paymentMethod("creditCard")
                        .installmentOption("fourOrMore")
                        .paymentTerm("thirtyDays")
                        .downPayment("twentyPercent")
                        .recurringBilling("no")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("28000.00"))
                        .recommendedPrice(new BigDecimal("35000.00"))
                        .premiumPrice(new BigDecimal("42000.00"))
                        .confidence((short) 75)
                        .riskScore((short) 65)
                        .riskLevel("high")
                        .probability("media")
                        .status("sent")
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .build();

                Proposal p4 = Proposal.builder()
                        .user(user)
                        .name("API de Integração de Pagamentos")
                        .projectType("api")
                        .complexity("medium")
                        .deadline("30 dias")
                        .meetingsFrequency("none")
                        .scopeDocumented(true)
                        .maintenance(false)
                        .estimatedHours(60)
                        .billingMethod("hourly")
                        .paymentMethod("pix")
                        .installmentOption("twoInstallments")
                        .paymentTerm("immediate")
                        .downPayment("none")
                        .recurringBilling("no")
                        .formalContract(false)
                        .minimumPrice(new BigDecimal("5000.00"))
                        .recommendedPrice(new BigDecimal("6500.00"))
                        .premiumPrice(new BigDecimal("8000.00"))
                        .confidence((short) 90)
                        .riskScore((short) 40)
                        .riskLevel("medium")
                        .probability("baixa")
                        .status("draft")
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .build();

                Proposal p5 = Proposal.builder()
                        .user(user)
                        .name("Site Institucional - Construtora")
                        .projectType("website")
                        .complexity("low")
                        .deadline("20 dias")
                        .meetingsFrequency("weekly")
                        .scopeDocumented(true)
                        .maintenance(false)
                        .estimatedHours(40)
                        .billingMethod("fixed")
                        .paymentMethod("pix")
                        .installmentOption("twoInstallments")
                        .paymentTerm("immediate")
                        .downPayment("fiftyPercent")
                        .recurringBilling("no")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("3200.00"))
                        .recommendedPrice(new BigDecimal("4000.00"))
                        .premiumPrice(new BigDecimal("5000.00"))
                        .confidence((short) 95)
                        .riskScore((short) 10)
                        .riskLevel("low")
                        .probability("perdida")
                        .status("lost")
                        .createdAt(LocalDateTime.now().minusDays(25))
                        .build();

                Proposal p6 = Proposal.builder()
                        .user(user)
                        .name("SaaS de Gestão Escolar (MVP)")
                        .projectType("webapp")
                        .complexity("high")
                        .deadline("60 dias")
                        .meetingsFrequency("biweekly")
                        .scopeDocumented(true)
                        .maintenance(true)
                        .estimatedHours(180)
                        .billingMethod("subscription")
                        .paymentMethod("creditCard")
                        .installmentOption("oneTime")
                        .paymentTerm("immediate")
                        .downPayment("none")
                        .recurringBilling("yes")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("16000.00"))
                        .recommendedPrice(new BigDecimal("20000.00"))
                        .premiumPrice(new BigDecimal("25000.00"))
                        .confidence((short) 80)
                        .riskScore((short) 50)
                        .riskLevel("high")
                        .probability("fechada")
                        .status("won")
                        .createdAt(LocalDateTime.now().minusDays(12))
                        .build();

                Proposal p7 = Proposal.builder()
                        .user(user)
                        .name("Consultoria DevOps e Cloud")
                        .projectType("api")
                        .complexity("low")
                        .deadline("30 dias")
                        .meetingsFrequency("weekly")
                        .scopeDocumented(true)
                        .maintenance(false)
                        .estimatedHours(30)
                        .billingMethod("hourly")
                        .paymentMethod("international")
                        .installmentOption("oneTime")
                        .paymentTerm("thirtyDays")
                        .downPayment("none")
                        .recurringBilling("no")
                        .formalContract(true)
                        .minimumPrice(new BigDecimal("4500.00"))
                        .recommendedPrice(new BigDecimal("5500.00"))
                        .premiumPrice(new BigDecimal("7000.00"))
                        .confidence((short) 90)
                        .riskScore((short) 20)
                        .riskLevel("low")
                        .probability("alta")
                        .status("sent")
                        .createdAt(LocalDateTime.now().minusDays(8))
                        .build();

                proposalRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7));
                log.info("[DatabaseSeeder] Semeadura finalizada com sucesso. 7 propostas variadas foram salvas.");
            } else {
                log.info("[DatabaseSeeder] O usuário já possui {} propostas. Pulando semeadura para evitar duplicatas.", existingProposals.size());
            }
        } else {
            log.warn("[DatabaseSeeder] Nenhum usuário cadastrado no banco de dados ainda. Não foi possível semear propostas.");
        }
    }
}
