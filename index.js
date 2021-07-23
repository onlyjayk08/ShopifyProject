const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
app.use(bodyParser.json());
app.use(router);
app.use(cors());

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DataBase, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Error: " + err);
});

db.on("connected", (err, res) => {
    if (err) {
        console.log("Error: " + err);
    }
    else {
        console.log("Mongoose is connected");
    }
});

if (process.env.NODE_ENV == "production") {
    // set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve("./", "client", "build", "index.html"));
    });
}

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));