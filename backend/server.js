const express = require("express");
const dotenv = require("dotenv");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer  = require('multer');
const path    = require('path');
const fs = require("fs");
//const mime = require("mime/lite");
const mime = require('mime-types');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const googleGenAI = new GoogleGenerativeAI(process.env.API_KEY)

const geminiProModel = googleGenAI.getGenerativeModel({
    model: "gemini-pro-vision"
})

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.send("Welcome to the Image Captioning API")
})

app.post("/caption-image", upload.single('file'), async (req, res) => {

    console.log(process.env.API_KEY);

    const filePath = req.file.path;
    const mimeType = mime.lookup(filePath);

    const imagePath = {
        inlineData: {
          data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
          mimeType
        },
    };

    const prompt = "Write an appropriate caption for this image to help visually-impaired users";

    const images = [
        imagePath
    ]

    const request = await geminiProModel.generateContent([prompt, ...images]);
    const response = await request.response;
    const caption = response.text();
    console.log(response);
    console.log(caption);

    res.send(caption);

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});