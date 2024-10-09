import express from 'express';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use(express.json());
app.use(cors());