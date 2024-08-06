import express from "express"
import User from "../models/user.js"
import SnappleFact from "../models/snapple-fact.js"

const usersRouter = express.Router()

// redirect to user page
usersRouter.get('/', async (req, res) => {
    try {
        if (req.session.user) {
            const username = req.session.user.username;

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

// Show user page
usersRouter.get('/:userID', async (req, res) => {

    const user = await User.findOne({ username: req.session.user.username });

    res.render('users/show.ejs', {
        user: user
    })
})

// Show all user comments
usersRouter.get('/:userID/comments', async (req, res) => {

    try {
        // if the user is signed in
        if (req.session.user) {

            //set username
            const username = req.session.user.username;

            // find user
            const user = await User.findOne({ username: username })

            // the users comments are embedded within the snapple facts so we 
            // find all snapple facts that have the user ID embedded somewhere in its comments 
            // this returns all of the facts as an array and all of the comments associated with each fact
            const snappleFacts = await SnappleFact.find({
                'comments.userId': user._id
            })

            // extract only the comments that match the user ID
            const userComments = [];
            snappleFacts.forEach(fact => {
                fact.comments.forEach(comment => {
                    if (comment.userId.equals(user._id)) {
                        userComments.push(comment);
                    }
                });
            });

            // render the ejs template with the comments
            res.render('users/comments.ejs', {
                user: user,
                userComments: userComments
            })
 
        } else {
            res.send('Please Log in');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
})

// Show all user stars
usersRouter.get('/:userID/stars', async (req, res) => {

    // const user = await User.findOne({ username: username });

    res.render('users/stars.ejs', {
        user: req.session.user
    })
})

export default usersRouter;