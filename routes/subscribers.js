const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

// Get all
router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Get one
router.get('/:id', async (req, res) => {
    const name = {name: req.params.id}
    try{
        const subscribers = await Subscriber.find(name)
        res.json(subscribers)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Create one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err){
        res.status(400).json({
            message: err.message
        })
    }
})

// Update one
router.patch('/:id', (req, res) => {
    
})

// Delete one
router.get('/:id', (req, res) => {
    
})

module.exports = router