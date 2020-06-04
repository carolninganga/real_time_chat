const path = require("path");
const express = require("express");

const app = express();

//this sets the static folder to serve the public folder
app.use(express.static(path.join(__dirname,"public")));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));