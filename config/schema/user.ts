import mongoose from 'mongoose'

const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email address"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
        ]
    },
    password: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User