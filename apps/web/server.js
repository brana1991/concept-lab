const express = require('express');
const path = require('path');
const app = express();

// Serve EPUB files
app.use('/epub-output', express.static(path.join(__dirname, '../epub-output')));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`EPUB server running at http://localhost:${PORT}`);
});
