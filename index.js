import express from "express";
import hbs from "express-hbs";
import morgan from "morgan";
import path from "path";
import {indexRoutes} from "./routes/indexRoutes.js";

export const app = express();
app.engine('hbs', hbs.express4());
app.set("view engine", "hbs");
app.set("views", path.resolve("views"));

app.use(morgan('dev'));
app.use(indexRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});