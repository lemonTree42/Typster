import express from "express";
import {indexController} from "../controller/indexController.js";
const router = express.Router();

router.get("/", indexController.showIndex);
router.post("/user", indexController.postUser);
router.get("/join", indexController.showJoin);
router.get("/host", indexController.showHost);

export const indexRoutes = router;