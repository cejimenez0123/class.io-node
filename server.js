import express from "express";
import  dotenv from "dotenv";
import  session from "express-session"
import  bodyParser from "body-parser"
import  passport from "passport"
import  cors from 'cors'
import  userRoutes from './routes/user.js'
import  topicRoutes from './routes/topic.js'
import quizRoutes from './routes/quiz.js'
import questionRoutes from './routes/question.js'
import flashcardRoutes from "./routes/flashcard.js"
import {setUpPassportLocal}from "./middleware/auth.js"

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const logger = (req, _res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method}: ${req.url}`);
    next();
    };
const authMiddleware = passport.authenticate('bearer', { session: false }); // Sessionless authentication

app.use(bodyParser.json());
app.use(logger);
app.get('/', (req, res, next) => {

    res.status(200).json({message:"Hello World"})
})
app.use("/flashcard",flashcardRoutes(authMiddleware))
app.use("/question",questionRoutes(authMiddleware))
app.use("/quiz",quizRoutes(authMiddleware))
app.use("/user",userRoutes(authMiddleware))
app.use("/topic",topicRoutes(authMiddleware));
setUpPassportLocal(passport);
app.use(
    session({
    secret: process.env.JWT_SECRET,resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust this based on you
    }))
app.use(passport.session());
app.use(passport.initialize());
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)
})
export default app