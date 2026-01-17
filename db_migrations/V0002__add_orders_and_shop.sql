CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(255),
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    product_type VARCHAR(50),
    product_id INTEGER,
    yookassa_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    payment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS privileges_shop (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    privilege_level VARCHAR(50) NOT NULL,
    duration_days INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(yookassa_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

INSERT INTO privileges_shop (name, privilege_level, duration_days, price, description, features) VALUES
('VIP на 30 дней', 'vip', 30, 500, 'VIP привилегия на месяц', ARRAY['VIP оружие', 'Респавн', 'Спецсчёт', 'VIP чат']),
('VIP на 90 дней', 'vip', 90, 1200, 'VIP привилегия на 3 месяца', ARRAY['VIP оружие', 'Респавн', 'Спецсчёт', 'VIP чат', 'Скидка 20%']),
('Premium на 30 дней', 'premium', 30, 1000, 'Premium привилегия на месяц', ARRAY['Всё из VIP', '+50 HP/Броня', 'Иммунитет к флешкам', 'Приоритет входа']),
('Premium на 90 дней', 'premium', 90, 2500, 'Premium привилегия на 3 месяца', ARRAY['Всё из VIP', '+50 HP/Броня', 'Иммунитет к флешкам', 'Приоритет входа', 'Скидка 15%'])
ON CONFLICT DO NOTHING;