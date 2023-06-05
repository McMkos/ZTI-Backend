const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercises')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Get all
router.get('/', async (req, res) => {
    const authToken = req.headers['authorization']
    const token = authToken && authToken.split(' ')[1]
    if(token == null){
        res.status(401).json({message: "Authentication token not provided"})
        return
    }
    else{
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            console.log(decoded.name)
            const exercises = await Exercises.findOne({'user': decoded.name})   
            res.json(exercises)
        } catch (error) {
            res.status(401).json({message: error.message})
            return
        }
    }
})

// Create one
router.post('/', async (req, res) => {
    const user = await User.findOne({'name': req.body.user})
    if(user != null){
        const authToken = req.headers['authorization']
        const token = authToken && authToken.split(' ')[1]
        if(token == null){
            res.status(401).json({message: "Authentication token not provided"})
            return
        }
        else{
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            } catch (error) {
                res.status(401).json({message: error.message})
                return
            }
        }
    }
    else{
        res.status(401).json({message: "User " + req.body.user + " not found"})
        return
    }

    const exercises = await Exercises.findOne({'user': req.body.user})
    
    if(exercises == null){
        try{
            const newExercises = new Exercises({
                user: req.body.user,
                exercises: [req.body.exercise]
            })
    
            const savedExercises = await newExercises.save()
            res.status(201).json(savedExercises)

        } catch (err){
            res.status(400).json({
                message: err.message
            })
        }
    }
    else{

        if (exercises.exercises.some(e => e.name === req.body.exercise.name)) {
            res.status(304).json({message: "Exercise already exists"})
        }
        else{
            exercises.exercises.push(req.body.exercise)
        const savedExercises = await exercises.save()
        res.status(201).json(savedExercises)
        }
    }
})

// Authenticate
router.post('/login', async (req, res) => {

    try{
        const user = await User.findOne({'name': req.body.name})
        if(user == null){
            res.status(400).json({message: 'User not found'})
        }
        else if( await bcrypt.compare(req.body.password, user.password) ){
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({accessToken: accessToken})
        }
        else{
            res.status(401).json({message: "Invalid password"})
        }
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router