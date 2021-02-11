import express from "express";
import hbs from "express-hbs";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import createError from 'http-errors';
import sharedsession from 'express-socket.io-session';
import {createServer} from 'http';
import {Server, Socket} from "socket.io";
import {indexRoutes} from "./routes/indexRoutes.js";
import {gameRoutes} from "./routes/gameRoutes.js";
import {gamesRoutes} from "./routes/gamesRoutes.js";
import {sessionUserSettings} from "./utils/sessionUserSettings.js";
import {playerSocketMap} from "./services/playerSocketMap.js";
import {gameStore} from "./services/gameStore.js"

export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('hbs', hbs.express4());
app.set("view engine", "hbs");
app.set("views", path.resolve("views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
let sessionobj = session({secret: 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda', resave: false, saveUninitialized: true});
app.use(sessionobj);
io.use(sharedsession(sessionobj));
app.use(sessionUserSettings);

io.on("connection", (socket) => {
    playerSocketMap[socket.handshake.session.user.nickname] = socket;
    socket.on("EVENT_CLIENT_INVOKE_START_GAME", (gameId) => {
        console.log("EVENT_CLIENT_INVOKE_START_GAME: "+gameId);
        const game = gameStore.get(gameId);
        game.start();
    });
});

app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use("/", indexRoutes);
app.use(function(req, res, next) {
    if(req.session.user.nickname==="") {
        res.redirect("/");
    } else {
        next();
    }
});
app.use("/game", gameRoutes);
app.use("/games", gamesRoutes);

app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.error.status = req.app.get('env') === 'development' ? err.status : {};
    res.locals.error.stack = req.app.get('env') === 'development' ? err.stack : {};

    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});