import mongoose from "mongoose"

const snappleFactSchema = new mongoose.Schema({
    fact: String,
    number: Number,
    isRetired: Boolean,
    source: Array
})

const SnappleFact = mongoose.model('Snapplefact', snappleFactSchema)

export default SnappleFact