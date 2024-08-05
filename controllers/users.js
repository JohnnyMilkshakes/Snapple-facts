import express from "express"
import User from "../models/user.js"
import SnappleFact from "../models/snapple-fact.js"

const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
    try {
        if (req.session.user) {
            const username = req.session.user.username;
            console.log(`Username: ${username}`);

            const user = await User.findOne({ username: username });
            if (user) {
                console.log(`User ID: ${user._id}`);
                res.redirect(`/users/${user._id}`);
            } else {
                res.send('User not found');
            }
        } else {
            res.send('Please Log in');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }


})

usersRouter.get('/:userID', async (req, res) => {

    // const user = await User.findOne({ username: username });

    res.render('users/show.ejs', {
        user: req.session.user
    })
})

export default usersRouter;