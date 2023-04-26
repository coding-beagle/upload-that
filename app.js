const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: ["https://upload-that.onrender.com", "https://uploadthat-service.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.STRING,
});

const corsOptions = {
  origin: ["https://upload-that.onrender.com", "https://uploadthat-service.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  let roomId; // Define roomId in the outer scope

  socket.on('joinRoom', (room) => {
    roomId = room; // Update roomId when a user joins a room
    socket.join(roomId);
    socket.to(roomId).emit('userJoined');
  });

  socket.on('fileUploaded', () => {
    if (roomId) {
      socket.to(roomId).emit('fetchFiles');
      socket.to(roomId).emit('hideLoadingElement');
    }
  });

  socket.on('fileUploading', () => {
    if (roomId) {
      socket.to(roomId).emit('showLoadingElement');
    }
  });

  socket.on('disconnect', () => {
    if (roomId) {
      socket.emit('leaveRoom');
    }
  });

  socket.on('leaveRoom', async () => {
    if (roomId) {
      socket.leave(roomId);
      socket.to(roomId).emit('userLeft');

      const clients = await io.in(roomId).fetchSockets();
      if (clients.length === 0) {
        try {
          const query = `
            DELETE FROM files
            WHERE qr_code_id = $1
          `;
          await pool.query(query, [roomId]);
        } catch (error) {
          console.error(error);
        }
      }
      roomId = null; // Clear roomId when a user leaves a room
    }
  });

  socket.on('fileDeleted', (deletedRoomId, fileId) => {
  socket.to(deletedRoomId).emit('fileDeletion', fileId);
  });
});


// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { qr_code_id } = req.body;
    const { originalname: file_name, mimetype: file_type, size: file_size, buffer: file_content } = req.file;

    const query = `
      INSERT INTO files (qr_code_id, file_name, file_size, file_content, file_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const result = await pool.query(query, [qr_code_id, file_name, file_size, file_content, file_type]);
    const file_id = result.rows[0].id;

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
      SELECT id, file_name, file_size, file_type
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

  app.delete('/delete/:file_id', async (req, res) => {
    try {
      const { file_id } = req.params;
  
      const query = `
        DELETE FROM files
        WHERE id = $1
      `;
      await pool.query(query, [file_id]);
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while deleting the file' });
    }
  });
  
