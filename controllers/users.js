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

    const user = await User.findOne({ username: req.session.user.username });



    res.render('users/show.ejs', {
        user: user
    })
})

usersRouter.get('/:userID/comments', async (req, res) => {

    try {
        // if the user is signed in
        if (req.session.user) {

            //set username
            const username = req.session.user.username;

            // find user
            const user = await User.findOne({ username: username })

            // get comments from snapple facts that have the user ID embedded in its comments 
            // this returns the entire fact document with all comments
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

usersRouter.get('/:userID/stars', async (req, res) => {

    // const user = await User.findOne({ username: username });

    res.render('users/stars.ejs', {
        user: req.session.user
    })
})

export default usersRouter;