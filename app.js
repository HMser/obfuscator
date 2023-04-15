const express = require('express');
const multer = require('multer');
const obfuscator = require('obfuscator');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }
  fs.readFile(file.path, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    const obfuscatedCode = obfuscator(data);
    res.set('Content-Disposition', 'attachment; filename=obfuscated.js');
    res.send(obfuscatedCode);
  });
});

app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'uploads/obfuscated.js');
  res.download(file);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
