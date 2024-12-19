// password mongoDB: NRE9993Pas3dfidx
// username aminaajk
const finRecordsRouter = require("./src/routes/fin-records");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 8081;

app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://aminaajk:NRE9993Pas3dfidx@finsight.r5jmc.mongodb.net/?retryWrites=true&w=majority&appName=FinSight";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch((err) => console.error("failed to connect:", err));

app.use("/fin-records", finRecordsRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
