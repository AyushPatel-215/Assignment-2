const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/createUser', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.genrateAuthToken()
        res.status(200).send({user,token})
    } catch (error) {
        res.status(401).send(error)
    }
})

router.get('/fetchUser',auth,async (req,res) => {
    res.status(201).send(req.user)
})


router.delete('/deleteUser',auth,async (req,res)=>{
    try {
        console.log(req.user instanceof User)
        await req.user.deleteOne()
        res.status(200).send(req.user) 
    } catch (error) {
        res.send(error)
    }
    
})

router.patch('/userUpdate',auth, async(req,res)=>{
    
    const updates = Object.keys(req.body)
    const alllowedUpdate = ['name','email','password','age']
    const isValidOperation = updates.every( (update) => alllowedUpdate.includes(update))

    if(!isValidOperation)
        return res.status(400).send('invalid updates!')
    
        try {
            updates.forEach( (update) => req.user[update] = req.body[update])
            req.user.save()
            res.status(201).send(req.user)
        } catch (error) {
            res.status(404).send('update error')
        }
})

router.post('/login', async (req,res) =>{
    try {
        console.log(req.body)
        const user = await User.findByCreadtials(req.body.email, req.body.password)
        const token = await user.genrateAuthToken()
        res.send({user,token})
    } catch (error) {
        console.log(error)
        res.status(400).send()
    } 
} )

router.get('/logout',auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.status(201).send('logout one device!')
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/logoutAll',auth, async (req,res)=>{
    try{
        req.user.tokens = []
        console.log(req.user)
        await req.user.save()
        res.send('All user logout')
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

console.log("users router is come..")
module.exports = router