const express = require('express');
const app = express();

app.use(express.static('dist'));

const path = require('path');
app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = 4173;
console.log('Frontend running on:',PORT);
app.listen(PORT);