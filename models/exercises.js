const mongoose = require('mongoose')

const singleExerciseSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    color:{
        type: String,
        required:true
    },
    tags:{
        type: [String],
        required: true
    }
})

const exercisesSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    exercises:{
        type: [singleExerciseSchema],
        required: false
    }
})

module.exports = mongoose.model('exercises', exercisesSchema)