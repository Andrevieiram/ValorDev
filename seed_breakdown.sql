-- Duplicar algumas propostas para dar mais volume de dados
INSERT INTO proposals (user_id, client_id, name, project_type, complexity, deadline, scope_documented, maintenance, meetings_frequency, reuse_components, estimated_hours, billing_method, payment_method, payment_term, down_payment, formal_contract, minimum_price, recommended_price, premium_price, confidence, risk_score, risk_level, probability, status)
SELECT user_id, client_id, name || ' (V2)', project_type, complexity, deadline, scope_documented, maintenance, meetings_frequency, reuse_components, estimated_hours, billing_method, payment_method, payment_term, down_payment, formal_contract, minimum_price, recommended_price, premium_price, confidence, risk_score, risk_level, probability, 'draft'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238' LIMIT 3;

INSERT INTO proposals (user_id, client_id, name, project_type, complexity, deadline, scope_documented, maintenance, meetings_frequency, reuse_components, estimated_hours, billing_method, payment_method, payment_term, down_payment, formal_contract, minimum_price, recommended_price, premium_price, confidence, risk_score, risk_level, probability, status)
SELECT user_id, client_id, name || ' - Revisado', project_type, complexity, deadline, scope_documented, maintenance, meetings_frequency, reuse_components, estimated_hours, billing_method, payment_method, payment_term, down_payment, formal_contract, minimum_price, recommended_price, premium_price, confidence, risk_score, risk_level, probability, 'lost'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238' LIMIT 2;

-- Inserir Breakdowns para TODAS as propostas do usuario
INSERT INTO proposal_breakdown_items (proposal_id, sort_order, label, value, description)
SELECT id, 1, 'Planejamento e Requisitos', 1500.00, 'Reuniões e documentação'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';

INSERT INTO proposal_breakdown_items (proposal_id, sort_order, label, value, description)
SELECT id, 2, 'Design UX/UI', 2500.00, 'Protótipos no Figma'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';

INSERT INTO proposal_breakdown_items (proposal_id, sort_order, label, value, description)
SELECT id, 3, 'Desenvolvimento Fullstack', 6000.00, 'Implementação do sistema e APIs'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';

INSERT INTO proposal_breakdown_items (proposal_id, sort_order, label, value, description)
SELECT id, 4, 'Testes e Homologação', 1000.00, 'QA e testes automatizados'
FROM proposals WHERE user_id = '3cea50be-69af-4c9e-8bdb-042502286238';
