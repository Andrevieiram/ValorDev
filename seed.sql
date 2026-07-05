-- Profile (se nao existir)
INSERT INTO user_profiles (user_id, desired_income, hours_per_week, experience_level, tax_regime, main_stack, workload, monthly_costs, financial_reserve, hourly_rate)
VALUES ('3cea50be-69af-4c9e-8bdb-042502286238', 12000.00, 40, 'senior', 'simples_nacional', 'backend', 'intense', 3000.00, 15000.00, 150.00)
ON CONFLICT (user_id) DO NOTHING;

-- Clientes
INSERT INTO clients (id, user_id, name, client_type, digital_experience, recurring_client, location, business_impact)
VALUES 
  ('c0000000-0000-0000-0000-000000000001', '3cea50be-69af-4c9e-8bdb-042502286238', 'Tech Corp', 'empresa', 'high', 'yes', 'nacional', 'alto'),
  ('c0000000-0000-0000-0000-000000000002', '3cea50be-69af-4c9e-8bdb-042502286238', 'Startup X', 'startup', 'medium', 'no', 'internacional', 'alto'),
  ('c0000000-0000-0000-0000-000000000003', '3cea50be-69af-4c9e-8bdb-042502286238', 'Padaria do Zé', 'pequeno_negocio', 'low', 'yes', 'local', 'baixo');

-- Update Propostas para usar os clientes acima (distribuir os 3 clientes entre as 7 propostas)
WITH p AS (SELECT id, row_number() over() as rn FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238')
UPDATE proposals pr
SET client_id = CASE 
  WHEN p.rn IN (1,4) THEN 'c0000000-0000-0000-0000-000000000001'::uuid
  WHEN p.rn IN (2,5,7) THEN 'c0000000-0000-0000-0000-000000000002'::uuid
  ELSE 'c0000000-0000-0000-0000-000000000003'::uuid
END
FROM p WHERE pr.id = p.id;

-- Breakdowns para as propostas
INSERT INTO proposal_breakdown_items (proposal_id, name, type, hours, subtotal)
SELECT id, 'Levantamento de Requisitos', 'analysis', 10, 1500.00
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';

INSERT INTO proposal_breakdown_items (proposal_id, name, type, hours, subtotal)
SELECT id, 'Desenvolvimento Frontend', 'development', 40, 6000.00
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';

INSERT INTO proposal_breakdown_items (proposal_id, name, type, hours, subtotal)
SELECT id, 'Configuração de Servidor e Deploy', 'infrastructure', 5, 750.00
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';
