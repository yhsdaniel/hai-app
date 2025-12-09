import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ConversationSchema = new Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

ConversationSchema.index({ participants: 1 })

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema)
export default Conversation