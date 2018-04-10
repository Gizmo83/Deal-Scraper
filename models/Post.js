var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new PostSchema oject
var PostSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true,
        unique: true
    },
    favorite: {
        type: Boolean,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Post = mongoose.model("Post", PostSchema);

// Export the Article model
module.exports = Post;