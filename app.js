const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.STRING,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { qr_code_id } = req.body;
    const { originalname: file_name, size: file_size, buffer: file_content } = req.file;

    const query = `
      INSERT INTO files (qr_code_id, file_name, file_size, file_content)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const result = await pool.query(query, [qr_code_id, file_name, file_size, file_content]);
    console.log('Result Rows:', result.rows);

    const file_id = result.rows[0].id;

    console.log('Response data:', { message: 'File uploaded successfully', file_id });
    res.status(201).json({ message: 'File uploaded successfully', file_id });    
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while uploading the file' });
  }
});

  app.get('/files/:qr_code_id', async (req, res) => {
    try {
      const { qr_code_id } = req.params;
  
      const query = `
        SELECT id, file_name, file_size
        FROM files
        WHERE qr_code_id = $1
      `;
      const { rows } = await pool.query(query, [qr_code_id]);
  
      res.send(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while fetching the files' });
    }
  });

  app.get('/download/:file_id', async (req, res) => {
    try {
      const { file_id } = req.params;
  
      const query = `
        SELECT file_name, file_content
        FROM files
        WHERE id = $1
      `;
      const { rows } = await pool.query(query, [file_id]);
  
      if (rows.length > 0) {
        const { file_name, file_content } = rows[0];
        res.setHeader('Content-Disposition', `attachment; filename=${file_name}`);
        res.send(file_content);
      } else {
        res.status(404).send({ error: 'File not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while downloading the file' });
    }
  });
  