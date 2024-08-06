import mongoose from "mongoose"
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    source: [{ type: String, required: true }],
    date: { type: Date, required: true }
});

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment