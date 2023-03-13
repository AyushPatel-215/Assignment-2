const mongoose = require('mongoose')

const innoventrySchema = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        trim: true
    },
    category:{
        type:String,
        require:true,
        trim:true
    },
    quantity:{
        type:Number,
        default:1,
    },
    manufacturing:{
        type:Date,
        default:new Date("2023-01-01")
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'users'
    }
})

const Inno = mongoose.model('inno',innoventrySchema)
module.exports = Inno