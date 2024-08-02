import express from "express"
// import User from "../models/user.js"
// import SnappleFact from "../models/snapple-fact.js"

const factsRouter = express.Router()

// facts index page

console.log("GOTHERE")
factsRouter.get('/', async (req, res) => {
    res.render('facts/index.ejs', {
        user: req.session.user
    })
})

export default factsRouter;