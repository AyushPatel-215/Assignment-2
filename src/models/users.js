const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Inno = require('./inventorys')

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email : {
        type:String,
        unique: true,
        useCreateIndex:true,
        autoIndex:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email envalid')
            }
        }
    },
    password: {
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.length<6)
                throw new Errorusers("pssword must be greater then 6 word") 
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
                throw new Error('age must be provide')
        }
    }, 
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
})

//to hide some details from customer
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// genrate autntication when create user 
userSchema.methods.genrateAuthToken = async function(){   
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thismypersonal')
    console.log('token is generate')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// this is for decrypt password
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

// this is for when user is remove all inventry delete
userSchema.pre("deleteOne", {document:true, query: false}, async function(next){
    const user = this
    console.log('all inventry for delete')
    await Inno.deleteMany({owner:user._id})
    next()
})

// this for check email or password valid in login
userSchema.statics.findByCreadtials = async (email,password) => {
    const user = await User.findOne({email})
    console.log(user)
    if(!user)
        throw new Error('Unable to login')
    
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
        throw new Error('Unable to login')
    return user
}

// connect both
userSchema.virtual('innos', {
    ref:'inno',
    localField:'_id',
    foreignField:'owner'
})

const User = mongoose.model('user',userSchema)
module.exports = User
