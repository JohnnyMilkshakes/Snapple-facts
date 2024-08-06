import express from "express"
// import User from "../models/user.js"
import SnappleFact from "../models/snapple-fact.js"

const factsRouter = express.Router()

// list of facts
factsRouter.get('/', async (req, res) => {

    const facts = await SnappleFact.find({})//.limit(20);

    res.render('facts/index.ejs', {
        user: req.session.user,
        facts: facts
    })
})

// single fact 
factsRouter.get('/:factNumber', async (req, res) => {
    let factNumber = req.params.factNumber

    const response = await SnappleFact.findOne({number:factNumber})



    res.render('facts/show.ejs', {
        user: req.session.user,
        snappleFact: response
    })
})

export default factsRouter;