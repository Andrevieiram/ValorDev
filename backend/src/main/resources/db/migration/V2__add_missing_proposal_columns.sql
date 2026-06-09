-- V2: Add missing columns to proposals table
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS installment_option VARCHAR(20) NOT NULL DEFAULT 'nenhum';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS recurring_billing VARCHAR(20) NOT NULL DEFAULT 'nao';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS tools_used TEXT;
