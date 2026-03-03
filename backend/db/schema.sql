CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS Churches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    church_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('super_admin', 'director', 'observer')) NOT NULL,
    club_id UUID, -- Nullable
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_name VARCHAR(255) NOT NULL,
    church_id UUID REFERENCES Churches(id),
    director_id UUID REFERENCES Users(id)
);

ALTER TABLE Users DROP CONSTRAINT IF EXISTS fk_user_club;
ALTER TABLE Users ADD CONSTRAINT fk_user_club FOREIGN KEY (club_id) REFERENCES Clubs(id);

CREATE TABLE IF NOT EXISTS Members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')) NOT NULL,
    class_level VARCHAR(50) CHECK (class_level IN ('Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide')) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('pathfinder', 'instructor')) NOT NULL,
    club_id UUID REFERENCES Clubs(id) NOT NULL,
    year_joined INTEGER NOT NULL,
    age INTEGER,
    instructor_rank VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES Clubs(id) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    video_link VARCHAR(255),
    baptism_count INTEGER,
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    admin_remark TEXT
);

CREATE TABLE IF NOT EXISTS Exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES Clubs(id) NOT NULL,
    class_level VARCHAR(50) NOT NULL,
    exam_type VARCHAR(50) CHECK (exam_type IN ('achievement_class', 'honor')) NOT NULL,
    honor_name VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    admin_comment TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    ai_analysis TEXT
);

CREATE TABLE IF NOT EXISTS Exam_Questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES Exams(id) NOT NULL,
    section VARCHAR(10) CHECK (section IN ('A', 'B', 'C')),
    question_type VARCHAR(50) CHECK (question_type IN ('objective', 'matching', 'theory', 'fill_gap')) NOT NULL,
    question_text TEXT NOT NULL,
    marks INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Honors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    honor_name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('class', 'general')) NOT NULL,
    class_level VARCHAR(50) CHECK (class_level IN ('Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide'))
);

CREATE TABLE IF NOT EXISTS Member_Honors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES Members(id) NOT NULL,
    honor_id UUID REFERENCES Honors(id) NOT NULL,
    year_earned INTEGER NOT NULL,
    CONSTRAINT unique_member_honor UNIQUE (member_id, honor_id)
);

CREATE TABLE IF NOT EXISTS Resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('pdf', 'link')) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES Users(id),
    receiver_id UUID REFERENCES Users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Activity_History (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES Clubs(id) NOT NULL,
    user_id UUID REFERENCES Users(id) NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure columns exist for retro-compatibility on existing Render databases
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS district VARCHAR(255);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS federation VARCHAR(255);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS pathfinder_director VARCHAR(255);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS church_pastor VARCHAR(255);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS pastor_phone_number VARCHAR(50);

ALTER TABLE Reports ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE Reports ADD COLUMN IF NOT EXISTS video_link VARCHAR(255);
ALTER TABLE Reports ADD COLUMN IF NOT EXISTS baptism_count INTEGER;
ALTER TABLE Reports DROP CONSTRAINT IF EXISTS reports_report_type_check;
ALTER TABLE Reports ALTER COLUMN file_url DROP NOT NULL;

ALTER TABLE Exams DROP CONSTRAINT IF EXISTS exams_class_level_check;
