import mongoose, { Document } from 'mongoose'

const Schema = mongoose.Schema
const MessageSchema = new Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

MessageSchema.index({ conversationId: 1, createAt: -1 })

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)
export default Message