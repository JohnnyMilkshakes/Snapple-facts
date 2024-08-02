import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import methodOverride from "method-override"
import morgan from "morgan"
import session from "express-session"
import path from "path"
import { fileURLToPath } from "url"

import authController from "./controllers/auth.js"
import factsController from "./controllers/facts.js"

const app = express()

// Simulate __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000"

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
    console.clear()
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)

    // Middleware to parse URL-encoded data from forms
    app.use(express.urlencoded({ extended: false }))
    // Middleware for using HTTP verbs such as PUT or DELETE
    app.use(methodOverride("_method"))
    // Morgan for logging HTTP requests
    app.use(morgan('dev'))

    app.use(express.static(path.join(__dirname, "public")));

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
        })
    )

    app.get("/", async (req, res) => {
        res.render("index.ejs", {
            user: req.session.user
        })
    })

    app.get("/vip-lounge", (req, res) => {
        if (req.session.user) {
          res.send(`Welcome to the party ${req.session.user.username}.`);
        } else {
          res.redirect('/auth/sign-in');
        }
      });      

    app.use('/auth', authController)
    app.use('/facts', factsController)

    app.listen(port, () => {
        console.log(`The express app is ready on port ${port}!`)
    })
})