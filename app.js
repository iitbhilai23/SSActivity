const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// React app for serve static files
app.use(express.static(path.join(__dirname, 'build')));

// for all requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
