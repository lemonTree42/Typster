import express from "express";
import {indexController} from "../controller/indexController.js";

const router = express.Router();

router.get("/", indexController.showIndex);

export const indexRoutes = router;