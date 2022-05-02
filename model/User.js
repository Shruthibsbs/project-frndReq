const mongoose=require ("mongoose")

const User=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    friendRequestSent:{
        type:Array,
        default:[]
    },
    friendRequestRecieved:{
        type:Array,
        default:[]
    },
    friends:{
        type:Array,
        default:[]
    },
    friendsuggestion:{
        type:Array,
        default:[]
    },
    mutualfriends:{
        type:Array,
        default:[]
    }
   
},{
    collection:"friends",
    timestamps:true
})
module.exports =mongoose.model ("User", User)