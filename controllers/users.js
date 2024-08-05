import express from "express"
import User from "../models/user.js"
import SnappleFact from "../models/snapple-fact.js"

const usersRouter = express.Router()


usersRouter.get('/', async (req, res) => {

    res.render('users/show.ejs', {
        user: req.session.user,
    })
})

usersRouter.get('/:factNumber', async (req, res) => {

    res.render('facts/show.ejs', {
        user: req.session.user
    })
})

export default usersRouter;