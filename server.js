// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/photos',(req,res)=>{res.sendFile(__dirname+'/views/photos.html')});
app.get('/stories',(req,res)=>{res.sendFile(__dirname+'/views/stories.html')});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
