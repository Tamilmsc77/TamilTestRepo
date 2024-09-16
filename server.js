const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Set the directory where firmware files are stored
const firmwareDirectory = path.join(__dirname, 'firmware');

// Securely handle file downloads
app.get('/server/downloadFirmware', (req, res) => {
    const requestedFile = req.query.firmware; // Get the requested file from query params
    
    // Sanitize and validate the requested file name
    if (isValidFile(requestedFile)) {
        const filePath = path.join(firmwareDirectory, requestedFile);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Send the file securely
            res.download(filePath, (err) => {
                if (err) {
                    res.status(500).send('Error downloading file');
                }
            });
        } else {
            res.status(404).send('File not found');
        }
    } else {
        res.status(400).send('Invalid file name');
    }
});

// Validate the file name to prevent path traversal
function isValidFile(fileName) {
    const allowedExtensions = ['.txt', '.pdf', '.bin']; // Allowed file extensions
    const allowedCharacters = /^[a-zA-Z0-9_\-\.]+$/; // Allowed characters (alphanumeric, _, -, and .)

    // Check file extension and ensure it contains only allowed characters
    return allowedExtensions.includes(path.extname(fileName)) && allowedCharacters.test(fileName);
}

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});