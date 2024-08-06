import mongoose from "mongoose"
import Comment from "./comment.js"
const Schema = mongoose.Schema
  
  const snappleFactSchema = new Schema({
    fact: { type: String, required: true },
    number: { type: Number, required: true },
    isRetired: { type: Boolean, required: true },
    source: [{ type: String, required: true }],
    comments: [Comment.schema], // Embedding comments
    stars: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users in a list to track stars
    discoveredBy: {type: Schema.Types.ObjectId, ref: 'User'}, // Referencing a possible user who discovered the fact
  });
const SnappleFact = mongoose.model('Snapplefact', snappleFactSchema)

export default SnappleFact