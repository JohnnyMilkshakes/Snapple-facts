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
import SnappleFact from "./models/snapple-fact.js"
import usersController from "./controllers/users.js"



const server = express()

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
    server.use(express.urlencoded({ extended: false }))
    // Middleware for using HTTP verbs such as PUT or DELETE
    server.use(methodOverride("_method"))
    // Morgan for logging HTTP requests
    server.use(morgan('dev'))

    server.use(express.static(path.join(__dirname, "public")));

    server.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
        })
    )

    server.get("/", async (req, res) => {

        const response = await SnappleFact.find({isRetired:false})

        const rand = Math.floor(Math.random() * 343)
        console.log("Snapple fact response: " + response[rand])


        res.render("index.ejs", {
            user: req.session.user,
            snappleFact: response[rand]
        })
    })

    server.get("/vip-lounge", (req, res) => {
        if (req.session.user) {
          res.send(`Welcome to the party ${req.session.user.username}.`);
        } else {
          res.redirect('/auth/sign-in');
        }
      });      

    server.use('/auth', authController)
    server.use('/users', usersController)
    server.use('/facts', factsController)

    server.listen(port, () => {
        console.log(`The express server is ready on port ${port}!`)
    })
})