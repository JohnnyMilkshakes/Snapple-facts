import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    stars: [{ type: Schema.Types.ObjectId, ref: 'SnappleFact' }],
    discoveredFacts: [{ type: Schema.Types.ObjectId, ref: 'SnappleFact' }] // Referencing a potential list of discovered facts
  });

const User = mongoose.model("User", userSchema);

export default User;
