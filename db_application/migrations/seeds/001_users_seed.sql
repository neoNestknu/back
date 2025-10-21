INSERT INTO users (username, email) VALUES
    ('Ivan', 'itverdyy@gmail.com')
ON CONFLICT (username) DO NOTHING;