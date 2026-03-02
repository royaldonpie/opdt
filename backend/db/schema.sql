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
    report_type VARCHAR(50) CHECK (report_type IN ('investiture', 'induction', 'enrollment', 'program')) NOT NULL,
    file_url TEXT NOT NULL,
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    admin_remark TEXT
);

CREATE TABLE IF NOT EXISTS Exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES Clubs(id) NOT NULL,
    class_level VARCHAR(50) CHECK (class_level IN ('Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide')) NOT NULL,
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
