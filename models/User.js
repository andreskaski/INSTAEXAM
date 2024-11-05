// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    school: { type: String },
    schoolLevel: { type: String },
    country: { type: String },
    city: { type: String }
});

module.exports = mongoose.model('User', userSchema);
