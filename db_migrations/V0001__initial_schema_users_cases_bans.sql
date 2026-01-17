-- Users table (synced with CS 1.6 server)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    balance INTEGER DEFAULT 0,
    privilege VARCHAR(50) DEFAULT 'user',
    play_time INTEGER DEFAULT 0,
    last_daily_spin TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case items (configurable prizes)
CREATE TABLE IF NOT EXISTS case_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('weapon', 'privilege', 'balance', 'playtime')),
    value INTEGER NOT NULL,
    chance DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User case history
CREATE TABLE IF NOT EXISTS case_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    case_item_id INTEGER REFERENCES case_items(id),
    won_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bans table
CREATE TABLE IF NOT EXISTS bans (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    steam_id VARCHAR(20),
    reason VARCHAR(200) NOT NULL,
    admin_steam_id VARCHAR(20) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Maps table
CREATE TABLE IF NOT EXISTS maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Server stats
CREATE TABLE IF NOT EXISTS server_stats (
    id SERIAL PRIMARY KEY,
    current_map VARCHAR(100),
    players_online INTEGER DEFAULT 0,
    max_players INTEGER DEFAULT 32,
    ct_score INTEGER DEFAULT 0,
    t_score INTEGER DEFAULT 0,
    round_time_left INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_steam_id VARCHAR(20) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default case items
INSERT INTO case_items (name, description, rarity, item_type, value, chance, icon) VALUES
('AWP Dragon Lore', 'Легендарное оружие', 'legendary', 'weapon', 5000, 0.50, 'Crosshair'),
('AK-47 Fire Serpent', 'Эпическое оружие', 'epic', 'weapon', 2000, 2.00, 'Crosshair'),
('M4A4 Howl', 'Легендарное оружие', 'legendary', 'weapon', 3000, 1.00, 'Crosshair'),
('Desert Eagle Blaze', 'Редкое оружие', 'rare', 'weapon', 800, 5.00, 'Crosshair'),
('VIP на месяц', 'Привилегия VIP', 'rare', 'privilege', 500, 10.00, 'Crown'),
('Admin на день', 'Админка на 24 часа', 'epic', 'privilege', 1500, 3.00, 'Crown'),
('1000 рублей', 'Пополнение баланса', 'epic', 'balance', 1000, 5.00, 'DollarSign'),
('500 рублей', 'Пополнение баланса', 'rare', 'balance', 500, 15.00, 'DollarSign'),
('100 рублей', 'Пополнение баланса', 'common', 'balance', 100, 30.00, 'DollarSign'),
('50 рублей', 'Пополнение баланса', 'common', 'balance', 50, 27.50, 'DollarSign');

-- Insert default maps
INSERT INTO maps (name, display_name) VALUES
('de_dust2', 'Dust II'),
('de_inferno', 'Inferno'),
('de_nuke', 'Nuke'),
('de_mirage', 'Mirage'),
('de_train', 'Train'),
('de_cache', 'Cache');

-- Insert initial server stats
INSERT INTO server_stats (current_map, players_online, max_players, ct_score, t_score, round_time_left) 
VALUES ('de_dust2', 0, 32, 0, 0, 180);

CREATE INDEX IF NOT EXISTS idx_users_steam_id ON users(steam_id);
CREATE INDEX IF NOT EXISTS idx_bans_steam_id ON bans(steam_id);
CREATE INDEX IF NOT EXISTS idx_bans_active ON bans(is_active);
CREATE INDEX IF NOT EXISTS idx_case_history_user ON case_history(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_steam ON admin_logs(admin_steam_id);
