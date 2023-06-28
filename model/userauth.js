const mongoose= require('mongoose');
const bcrypt =require('bcryptjs')
const jwt= require('jsonwebtoken')
const userauthSchema= new mongoose.Schema({
    password:{
        type:String,
        required:true
    },
    eid:{
        type:String,
        required:true,
        unique:true
    },
    user:[{type:mongoose.Types.ObjectId,ref:"USER",required:true}],
    tokens:[
        {
            token: {
                type:String,
                required:true
            }
        }
    ]
})


userauthSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,1);
    }
        next();
});

userauthSchema.methods.generateAuthToken = async function(){
    try {
        token =jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
        
    }
}
const Userauth= mongoose.model("USERAUTH",userauthSchema);

module.exports=Userauth;
