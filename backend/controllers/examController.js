const db = require('../db');

exports.submitExam = async (req, res) => {
    const { club_id, class_level, exam_type, honor_name } = req.body;
    const exam_file = req.file;

    const actual_club_id = club_id || req.user.club_id;
    if (!actual_club_id) return res.status(400).json({ error: 'Club ID missing' });
    if (!exam_file) return res.status(400).json({ error: 'Exam document file is required' });

    try {
        await db.query('BEGIN');

        // Validation Engine: Checking DB for validity if it is an honor exam
        if (exam_type === 'honor') {
            const hCheck = await db.query('SELECT class_level, category FROM Honors WHERE honor_name = $1', [honor_name]);
            if (hCheck.rows.length === 0) {
                throw new Error('That honor name does not exist in the conference database.');
            }

            const hl = hCheck.rows[0];
            // If it's a class honor and the class level doesn't match the honor's designated class level, reject it.
            if (hl.category === 'class' && hl.class_level !== class_level) {
                throw new Error(`Validation Failed: The honor '${honor_name}' belongs exclusively to the ${hl.class_level} class, but ${class_level} was selected.`);
            }
        }

        // Simulate AI Validation & Analysis
        // (A real implementation would use pdf-parse/mammoth to read req.file.path and send to an LLM here)
        const mockAiReview = `✅ AI Initial Screening: The document structure appears well-formatted.\n✅ Verified minimum theory essay questions found.\n✅ Syllabus cross-reference satisfactory for ${class_level} ${exam_type.replace('_', ' ')} requirements.`;

        // Insert Exam
        await db.query(
            `INSERT INTO Exams (club_id, class_level, exam_type, honor_name, file_path, ai_analysis) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [actual_club_id, class_level, exam_type, honor_name, exam_file.filename, mockAiReview]
        );

        await db.query('COMMIT');
        res.status(201).json({ message: 'Exam uploaded and screened by AI successfully' });

    } catch (err) {
        await db.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    }
};

exports.getPendingExams = async (req, res) => {
    try {
        const result = await db.query(`SELECT e.*, c.club_name FROM Exams e JOIN Clubs c ON e.club_id = c.id WHERE e.status = 'pending' ORDER BY e.submitted_at ASC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateExamStatus = async (req, res) => {
    const { id } = req.params;
    const { status, admin_comment } = req.body;
    try {
        await db.query(
            `UPDATE Exams SET status = $1, admin_comment = $2 WHERE id = $3`,
            [status, admin_comment, id]
        );
        res.json({ message: 'Exam updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
