const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Serve static files from the frontend (client/public)
app.use(express.static(path.join(__dirname, '../client/src')));

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Catch-all route to serve index.html for any other request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src/app.js'));
});

app.get('/rajan', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/rajan.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
