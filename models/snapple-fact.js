import mongoose from "mongoose"
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    Source: [{ type: String, required: true }],
    Date: { type: Date, required: true }
  });
  
  const snappleFactSchema = new mongoose.Schema({
    fact: { type: String, required: true },
    number: { type: Number, required: true },
    isRetired: { type: Boolean, required: true },
    Source: [{ type: String, required: true }],
    Comments: [CommentSchema], // Embedding comments
    Stars: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users in a list to track stars
    DiscoveredBy: {type: Schema.Types.ObjectId, ref: 'User'}, // Referencing a possible user who discovered the fact
  });
const SnappleFact = mongoose.model('Snapplefact', snappleFactSchema)

export default SnappleFact