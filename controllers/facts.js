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

factsRouter.get('/:factNumber', async (req, res) => {
    let factNumber = req.params.factNumber
    res.render('facts/show.ejs', {
        user: req.session.user,
        factNumber: factNumber
    })
})

export default factsRouter;