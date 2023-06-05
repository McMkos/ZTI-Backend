const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Get all
router.get('/', async (req, res) => {
    try{
        const users = await User.find({},'name email')
        console.log(req.headers)
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Create one
router.post('/', async (req, res) => {
    const user = await User.findOne({$or:[{'name': req.body.name}, {'email': req.body.email}]})
    if(user == null){
        try{
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
    
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
            console.log(accessToken)
            const newUser = await user.save()
            res.status(200).json({accessToken: accessToken})
        } catch (err){
            res.status(400).json({
                message: err.message
            })
        }
    }
    else{
        if(user.name === req.body.name){
            res.status(400).json({message: 'User named ' + req.body.name + ' already exists'})
        }else{
            res.status(400).json({message: 'Email ' + req.body.email + ' already in use'})
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