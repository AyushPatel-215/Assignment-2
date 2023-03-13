const express = require('express')
const router = new express.Router()
const Inno = require('../models/inventorys')
const auth = require('../middleware/auth')

router.post('/createInno' ,auth, async(req,res) =>{

    const inno = new Inno({
        ...req.body,
        owner: req.user._id
    })
    try {
        await inno.save()
        res.status(200).send(inno)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

// all inventry are fetch by user
router.get('/fetchInno',auth, async(req,res) => {
    try {
        await req.user.populate({
            path:'innos'
        })
        console.log(req.user.innos)
        res.status(201).send(req.user.innos)
    } catch (e) {
        console.log(e)
        res.status(401).send('no find Inventory!')        
    }   
})

// single inventry fetch 
router.get('/fetchInno/one/:id', auth, async(req,res) => {
    try{
        const data = await Inno.findOne({_id:req.params.id, owner:req.user._id})
        if(!data)
            return res.status(402).send('no find inventry')
        res.status(201).send(data)
    }catch(error){
        res.send(error)
    }
})

router.delete('/deleteInno/:id',auth, async(req,res) => {
    try {
        console.log(req.user._id , )
        const InoData = await Inno.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        res.status(201).send(InoData)
    } catch (error) {
        res.status(401).send(error)
    }   
})

router.patch('/updateInno/:id',auth, async(req,res) => {
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','category','quantity','manufacturing']
    const isValidUpdate = updates.every( (update) => allowedUpdates.includes(update))

    if(!isValidUpdate)
        return res.status(401).send('invalid Update!')
    try{
        // const data =await Inno.findByIdAndUpdate({id,owner:req.user._id},req.body,{new:true,runValidators:true})
        const data = await Inno.findOne({_id:id,owner:req.user._id})
        if(!data)
            res.status(402).send('No one Inventry')

        updates.forEach( (update) => data[update] = req.body[update])
        data.save()
        res.status(201).send(data)
    }catch(error){
        console.log(error)
        res.status(301).send(error)
    }
})

console.log("innoventry router..")
module.exports = router