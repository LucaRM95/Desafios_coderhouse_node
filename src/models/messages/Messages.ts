import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageModel = new Schema({
    user: String,
    message: String,
});

const Message = mongoose.model('Message', messageModel);

export default Message;