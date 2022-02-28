import express from "express";
import notesRouter from "./routes/notes";

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => res.send("Homepage"));
app.use("/api/notes", notesRouter);
app.get("*", (req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Server running on port ${port}`));
