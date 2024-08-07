import express from "express"
import User from "../models/user.js"
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

    const snappleFact = await SnappleFact.findOne({number:factNumber}).populate('comments.userId')

    console.log(snappleFact)

    res.render('facts/show.ejs', {
        user: req.session.user,
        snappleFact: snappleFact
    })
})

// comment submission
factsRouter.post('/:factNumber/comments', async (req, res) => {
    try {
        if(!req.session.user) {
            res.send("YOU MUST BE LOGGED IN")
        } else {
            // Get fact number from URL
            const { factNumber } = req.params; 

            // Get comment details from request body
            const { comment, source } = req.body; 

            // Get user from DB
            const userObj = await User.findOne({ username: req.session.user.username });

            // get ID
            const userId = userObj._id 
    
            // Find the Snapple fact by number
            const snappleFact = await SnappleFact.findOne({ number: factNumber });
            if (!snappleFact) {
                return res.status(404).json({ error: 'Snapple fact not found' });
            }
    
            // Create the new comment in order to generate an ID for the user to reference
            const newComment = snappleFact.comments.create({
                userId: userId,
                comment: comment,
                source: Array.isArray(source) ? source : [source], // Ensure source is an array
                date: new Date()
            });
    
            // Embed new comment to the comments array on the snappleFact object 
            snappleFact.comments.push(newComment);

            // add comment id as a reference to the user comments array
            userObj.comments.push(newComment._id);
            
    
            // Save the Snapple fact with the new comment, and the user with a reference to the comment 
            await snappleFact.save();
            await userObj.save();
    
            res.redirect(`/facts/${factNumber}`)
        }

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'An error occurred while adding the comment' });
    } 
})

factsRouter.get('/:factNumber/comments/:commentId/edit', async (req, res) => {
    let factNumber = req.params.factNumber
    const commentId = req.params.commentId

    const snappleFact = await SnappleFact.findOne({number:factNumber}).populate('comments.userId')

    console.log("entire snapple fact: " + snappleFact)

    let commentToEdit
    snappleFact.comments.forEach((comment) => {
        console.log("Inside for loop, comment: " + comment)
        console.log("Inside for loop, comment._id: " + comment._id)
        console.log("Inside for loop, commentId: " + commentId)

        console.log("TYPEOF comment._id" + typeof comment._id.toString())
        console.log("TYPEOF commentId" +typeof commentId)

        if (comment._id.toString() === commentId) {
            commentToEdit = comment
            return
        }
    })

    console.log("COMMENT TO EDIT" + commentToEdit)

    res.render('facts/edit.ejs', {
        user: req.session.user,
        snappleFact: snappleFact,
        comment: commentToEdit
    })
})

factsRouter.put('/:factNumber/comments/:commentId', async (req, res) => {

    const commentId = req.params.commentId
    const factNumber = req.params.factNumber

    const result = await SnappleFact.updateOne(
        { 'comments._id': commentId },
        { $set: { 'comments.$': newCommentData } }
      );


    console.log("Result: " + result)
    res.redirect(`/${factNumber}`)
  });

factsRouter.delete('/:factNumber/comments/:commentId', async (req, res) => {

    const commentId = req.params.commentId

    const result = await SnappleFact.updateOne(
        { 'comments._id': commentId },
        { $pull: { comments: { _id: commentId } } }
      );


    console.log("Result: " + result)
    res.redirect(`/users/`)
  });

export default factsRouter;