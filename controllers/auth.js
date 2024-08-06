import express from "express"
import User from "../models/user.js"
import bcrypt from "bcrypt"

const authRouter = express.Router()

authRouter.get('/sign-up', async (req,res) => {
    res.render("auth/sign-up.ejs")
})

authRouter.post('/sign-up', async (req,res) => {

    const user = await User.findOne({username: req.body.username})

    if (user) {
        res.send("User exists")
    } 

    if (req.body.password !== req.body.confirmPassword) {
        res.send("Password doesnt match confirm")
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    const newUser = await User.create(req.body)
    res.send(`New User Registered: ${newUser.username}`)

})

authRouter.get('/sign-in', async (req,res) => {
    res.render('auth/sign-in.ejs')
})


authRouter.post('/sign-in', async (req,res) => {
    // check if user exists
    const user = await User.findOne({username: req.body.username})

    try {
        if (!user) {
            res.send("Wrong username")
        } 

        // compare provided raw password with hashed password
        const validPassword = bcrypt.compareSync(req.body.password, user.password)

        if(!validPassword) {
            res.send("Wrong password")
        }
        
        req.session.user = {
            username: user.username
        }

        res.redirect('/')

    } catch (err) {
        console.error(`Not able to sign in ${err}`)
    }
})

authRouter.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

export default authRouter;