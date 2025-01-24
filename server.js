const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());

app.use(express.json());

app.post('/upload', upload.single('boleta'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  res.json({ filePath: `/uploads/${req.file.filename}` });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
