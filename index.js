const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8060;
const templates = ['index1.ejs', 'index2.ejs', 'index.ejs','index3.ejs','index4.ejs','index5.ejs']; // Ensure all file names are correct

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up multer to process the incoming file data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homep.html'));
});

app.post('/generate-id', upload.fields([
    { name: 'companyLogo', maxCount: 1 },
    { name: 'userLogo', maxCount: 1 },
    { name: 'userPhoto', maxCount: 1 }
]), (req, res) => {
    const { companyName, userName, idNumber, contact } = req.body;
    const companyLogo = req.files.companyLogo ? req.files.companyLogo[0].filename : null;
    const userLogo = req.files.userLogo ? req.files.userLogo[0].filename : null;
    const userPhoto = req.files.userPhoto ? req.files.userPhoto[0].filename : null;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    res.render(randomTemplate, {
        companyLogo: companyLogo ? `/uploads/${companyLogo}` : null,
        companyName,
        userLogo: userLogo ? `/uploads/${userLogo}` : null,
        userPhoto: `/uploads/${userPhoto}`,
        userName,
        idNumber,
        contact
    });
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
