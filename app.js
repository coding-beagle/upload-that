const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const cors = require('cors');
const crypto = require('crypto');

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
    deleteOldFiles();
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

    const algorithm = 'aes-256-cbc';
    
    // Generate a unique salt for each file. You could use the file ID, for example.
    // You need to store this salt to be able to recreate the key for decryption.
    const salt = crypto.randomBytes(16).toString('hex');
    console.log('Generated salt:', salt);

    // Generate the encryption key from the qr_code_id and the salt
    const key = crypto.pbkdf2Sync(qr_code_id, salt, 100000, 32, 'sha512');

    const iv = crypto.randomBytes(16); // For AES, this is always 16
    console.log('Generated IV:', iv.toString('hex'));

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(file_content), cipher.final()]);
    
    const encryptedFile = {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
    };

    // Now you can store encryptedFile.content in the database, and you need to securely store the key and IV for decryption

    const query = `
      INSERT INTO files (qr_code_id, file_name, file_size, file_content, file_type, salt, iv)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const result = await pool.query(query, [qr_code_id, file_name, file_size, encryptedFile.content, file_type, salt, encryptedFile.iv]);
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
      SELECT id, file_name, file_size, file_type, file_content, iv, salt
      FROM files
      WHERE qr_code_id = $1
    `;
    const { rows } = await pool.query(query, [qr_code_id]);

    // Decrypt the file content
    const decryptedFiles = rows.map(file => {
      const algorithm = 'aes-256-cbc';
      
      // Convert salt and iv back to buffer
      const salt = Buffer.from(file.salt, 'hex');
      const iv = Buffer.from(file.iv, 'hex');

      const saltHex = salt.toString('hex');
      const ivHex = iv.toString('hex');
      
      // Recreate the encryption key from the qr_code_id and the salt
      const key = crypto.pbkdf2Sync(qr_code_id, saltHex, 100000, 32, 'sha512');
      
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
      const decrypted = Buffer.concat([decipher.update(Buffer.from(file.file_content, 'hex')), decipher.final()]);

      // Replace the encrypted file content with the decrypted content
      return {
        ...file,
        file_content: decrypted
      };
    });

    res.send(decryptedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching the files' });
  }
});

app.get('/download/:file_id', async (req, res) => {
  try {
    const { file_id } = req.params;

    const query = `
      SELECT file_name, file_content, iv, salt, qr_code_id
      FROM files
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [file_id]);

    if (rows.length > 0) {
      const { file_name, file_content, iv, salt, qr_code_id } = rows[0];

      // Recreate the encryption key from the qr_code_id and the salt
      const key = crypto.pbkdf2Sync(qr_code_id, salt, 100000, 32, 'sha512');

      // Decrypt the file content
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
      const decrypted = Buffer.concat([decipher.update(Buffer.from(file_content, 'hex')), decipher.final()]);
      
      res.setHeader('Content-Disposition', `attachment; filename=${file_name}`);
      res.send(decrypted);
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
  
  async function deleteOldFiles() {
    try {
      const query = `
        DELETE FROM files
        WHERE created_at < (NOW() - INTERVAL '10 minutes')
      `;
      await pool.query(query);
  
    } catch (error) {
      console.error('An error occurred while deleting old files:', error);
    }
  }
  