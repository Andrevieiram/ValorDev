-- 1. Inserir usuario de teste (caso não exista)
-- A senha é 'password123'
INSERT INTO users (id, name, email, password_hash, created_at)
VALUES ('3cea50be-69af-4c9e-8bdb-042502286238', 'Dev Freelancer', 'kevinkennedy.dev@gmail.com', '$2a$10$bG/Q7sKDljyeBuju8DZlie4wBxHb2V8qXn76eFtA5VOHe8Uy7Ymom', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 2. Inserir Perfil Financeiro (Valores em MAIÚSCULO para bater com os Enums do Java)
INSERT INTO user_profiles (user_id, desired_income, hours_per_week, experience_level, tax_regime, main_stack, workload, monthly_costs, financial_reserve, hourly_rate)
VALUES ('3cea50be-69af-4c9e-8bdb-042502286238', 12000.00, 40, 'SENIOR', 'SIMPLES_NACIONAL', 'BACKEND', 'intense', 3000.00, 15000.00, 150.00)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Inserir Clientes Fictícios
INSERT INTO clients (id, user_id, name, client_type, digital_experience, recurring_client, location, business_impact)
VALUES 
  ('c0000000-0000-0000-0000-000000000001', '3cea50be-69af-4c9e-8bdb-042502286238', 'Tech Corp', 'empresa', 'high', 'yes', 'nacional', 'alto'),
  ('c0000000-0000-0000-0000-000000000002', '3cea50be-69af-4c9e-8bdb-042502286238', 'Startup X', 'startup', 'medium', 'no', 'internacional', 'alto'),
  ('c0000000-0000-0000-0000-000000000003', '3cea50be-69af-4c9e-8bdb-042502286238', 'Padaria do Zé', 'pequeno_negocio', 'low', 'yes', 'local', 'baixo')
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir Propostas já linkadas aos Clientes
-- Usamos 'ON CONFLICT DO NOTHING' mas precisamos de uma chave unica (na tabela não tem constraint UNIQUE alem do ID).
-- Para evitar duplicar em múltiplas execuções, checamos se não existem propostas mockadas.
INSERT INTO proposals (id, user_id, client_id, name, project_type, complexity, deadline, scope_documented, maintenance, meetings_frequency, reuse_components, estimated_hours, billing_method, payment_method, payment_term, down_payment, formal_contract, minimum_price, recommended_price, premium_price, confidence, risk_score, risk_level, probability, status, created_at)
SELECT * FROM (VALUES 
  (gen_random_uuid(), '3cea50be-69af-4c9e-8bdb-042502286238'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid, 'Landing Page - Nutricionista (Mock)', 'landingPage', 'low', '15 dias', true, false, 'weekly', true, 20, 'fixed', 'pix', 'immediate', 'fiftyPercent', false, 1800.00, 2200.00, 2800.00, 95::smallint, 15::smallint, 'low', 'fechada', 'won', CURRENT_TIMESTAMP),
  (gen_random_uuid(), '3cea50be-69af-4c9e-8bdb-042502286238'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid, 'E-commerce - Loja de Roupas (Mock)', 'ecommerce', 'medium', '45 dias', true, true, 'weekly', true, 120, 'fixed', 'pix', 'immediate', 'thirtyPercent', true, 12000.00, 15000.00, 18000.00, 85::smallint, 35::smallint, 'medium', 'alta', 'sent', CURRENT_TIMESTAMP),
  (gen_random_uuid(), '3cea50be-69af-4c9e-8bdb-042502286238'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid, 'App de Delivery Local (Mock)', 'mobile', 'high', '90 dias', true, true, 'biweekly', false, 250, 'milestone', 'creditCard', 'thirtyDays', 'twentyPercent', true, 28000.00, 35000.00, 42000.00, 75::smallint, 65::smallint, 'high', 'media', 'sent', CURRENT_TIMESTAMP)
) AS v
WHERE NOT EXISTS (
  SELECT 1 FROM proposals WHERE name LIKE '%(Mock)%'
);

-- 5. Inserir Breakdown Items associados às propostas recém-criadas
INSERT INTO proposal_breakdown_items (id, proposal_id, sort_order, label, value, description)
SELECT gen_random_uuid(), id, 1, 'Planejamento e Requisitos', 1500.00, 'Reuniões e documentação'
FROM proposals WHERE name LIKE '%(Mock)%'
  AND NOT EXISTS (SELECT 1 FROM proposal_breakdown_items WHERE label = 'Planejamento e Requisitos' AND proposal_id = proposals.id);

INSERT INTO proposal_breakdown_items (id, proposal_id, sort_order, label, value, description)
SELECT gen_random_uuid(), id, 2, 'Design UX/UI', 2500.00, 'Protótipos no Figma'
FROM proposals WHERE name LIKE '%(Mock)%'
  AND NOT EXISTS (SELECT 1 FROM proposal_breakdown_items WHERE label = 'Design UX/UI' AND proposal_id = proposals.id);

INSERT INTO proposal_breakdown_items (id, proposal_id, sort_order, label, value, description)
SELECT gen_random_uuid(), id, 3, 'Desenvolvimento Fullstack', 6000.00, 'Implementação'
FROM proposals WHERE name LIKE '%(Mock)%'
  AND NOT EXISTS (SELECT 1 FROM proposal_breakdown_items WHERE label = 'Desenvolvimento Fullstack' AND proposal_id = proposals.id);
