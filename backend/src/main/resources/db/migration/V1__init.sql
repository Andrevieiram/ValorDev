-- V1__init.sql

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(180) NOT NULL UNIQUE,
    password_hash   VARCHAR(120) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_profiles (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    desired_income       NUMERIC(12,2) NOT NULL,
    hours_per_week       INT NOT NULL,
    experience_level     VARCHAR(20) NOT NULL,
    tax_regime           VARCHAR(20) NOT NULL,
    main_stack           VARCHAR(20) NOT NULL,
    workload             VARCHAR(20) NOT NULL,
    monthly_costs        NUMERIC(12,2) NOT NULL DEFAULT 0,
    financial_reserve    NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE clients (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                 VARCHAR(180) NOT NULL,
    client_type          VARCHAR(20) NOT NULL,
    digital_experience   VARCHAR(20) NOT NULL,
    recurring_client     VARCHAR(20) NOT NULL,
    location             VARCHAR(20) NOT NULL,
    business_impact      VARCHAR(20) NOT NULL
);

CREATE TABLE proposals (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id            UUID REFERENCES clients(id),
    name                 VARCHAR(180) NOT NULL,

    -- inputs (campos do wizard, sem JSONB por simplicidade)
    project_type         VARCHAR(20) NOT NULL,
    complexity           VARCHAR(20) NOT NULL,
    deadline             VARCHAR(60) NOT NULL,
    scope_documented     BOOLEAN NOT NULL,
    maintenance          BOOLEAN NOT NULL,
    meetings_frequency   VARCHAR(20) NOT NULL,
    external_dependencies TEXT,
    reuse_components     BOOLEAN NOT NULL,
    estimated_hours      INT NOT NULL,
    billing_method       VARCHAR(20) NOT NULL,
    payment_method       VARCHAR(20) NOT NULL,
    payment_term         VARCHAR(20) NOT NULL,
    down_payment         VARCHAR(20) NOT NULL,
    formal_contract      BOOLEAN NOT NULL,

    -- resultado calculado
    minimum_price        NUMERIC(12,2) NOT NULL,
    recommended_price    NUMERIC(12,2) NOT NULL,
    premium_price        NUMERIC(12,2) NOT NULL,
    confidence           SMALLINT NOT NULL,
    risk_score           SMALLINT NOT NULL,
    risk_level           VARCHAR(20) NOT NULL,
    probability          VARCHAR(20) NOT NULL DEFAULT 'media',
    status               VARCHAR(20) NOT NULL DEFAULT 'draft',

    created_at           TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE proposal_breakdown_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id   UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    sort_order    SMALLINT NOT NULL,
    label         VARCHAR(120) NOT NULL,
    value         NUMERIC(12,2) NOT NULL,
    description   TEXT
);
