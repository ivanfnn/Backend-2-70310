import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
    role: { type: String, default: "user" }
});


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
    next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
