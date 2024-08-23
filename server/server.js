const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const app = express();

// Allow requests from all origins
app.use(cors());

// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route to fetch images from categories
app.get('/gallery_data', (req, res) => {
    const imagesFolder = path.join(__dirname, 'images');

    fs.readdir(imagesFolder, (err, categories) => {
        if (err) {
            console.error('Error reading images directory:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Iterate through categories
            const categoriesWithImages = categories.map(category => {
                const categoryPath = path.join(imagesFolder, category);
                const imagesInCategory = fs.readdirSync(categoryPath).map(image => ({
                    name: image,
                    path: `http://localhost:3000/${category}/${image}`
                }));
                return { name: category, images: imagesInCategory };
            });
            res.json(categoriesWithImages);
        }
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
