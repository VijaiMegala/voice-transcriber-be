
--  USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);


--  TRANSCRIPTS TABLE
CREATE TABLE IF NOT EXISTS transcripts (
    transcript_id SERIAL PRIMARY KEY,
    transcript_name VARCHAR(255) NOT NULL,
    transcript TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_transcript_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Indexes for transcripts
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_name ON transcripts(transcript_name);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at);

--  DICTIONARY TABLE
CREATE TABLE IF NOT EXISTS dictionary (
    word_id SERIAL PRIMARY KEY,
    current_word VARCHAR(255) NOT NULL,
    replacement_word VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_dictionary_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Indexes for dictionary
CREATE INDEX IF NOT EXISTS idx_dictionary_user_id ON dictionary(user_id);
CREATE INDEX IF NOT EXISTS idx_dictionary_current_word ON dictionary(current_word);
CREATE INDEX IF NOT EXISTS idx_dictionary_created_at ON dictionary(created_at);
