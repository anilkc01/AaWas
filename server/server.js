const express = require('express');
const app = express();
const PORT = 5001;

// Example route
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
