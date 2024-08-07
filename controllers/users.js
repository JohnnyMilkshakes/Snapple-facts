import express from "express"
import User from "../models/user.js"
import SnappleFact from "../models/snapple-fact.js"
import mongoose from "mongoose"

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

    const userComments = await getUserComments(req.session.user)
    const userStars = await getUserStars(req.session.user)

    console.log("Stars: " + userStars)

    res.render('users/show.ejs', {
        user: user,
        userComments: userComments,
        userStars: userStars,
    })
})

// Show all user comments
usersRouter.get('/:userID/comments', async (req, res) => {

    try {
        // if the user is signed in
        if (req.session.user) {

            const userComments = await getUserComments(req.session.user)

            // render the ejs template with the comments
            res.render('users/comments.ejs', {
                user: req.session.user,
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

    const userStars = await getUserStars(req.session.user)

    console.log("Stars: " + userStars)

    res.render('users/stars.ejs', {
        user: req.session.user,
        userStars: userStars
    })
})

async function getUserComments(userSession) {
    //set username
    const username = userSession.username;

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

    return userComments
}

async function getUserStars(userSession) {
    //set username
    const username = userSession.username;

    // find user
    const user = await User.findOne({ username: username })
    console.log("User ID:" + user._id)

    // the users comments are embedded within the snapple facts so we 
    // find all snapple facts that have the user ID referenced in its stars array 
    // this returns all of the facts as an array
    const snappleFacts = await SnappleFact.find({stars: user._id})

    // console.log(snappleFacts)

    // snappleFacts[0].stars.push(user._id)

    // snappleFacts[0].save()

    console.log("Array before returning: " +  snappleFacts)

    return snappleFacts
}

export default usersRouter;