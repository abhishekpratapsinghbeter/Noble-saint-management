const express= require('express');
const router= express.Router();
require('../db/conn')
const moment = require("moment");
const cookieParser = require("cookie-parser");
const authenticate = require("../middleware/authenticate");
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User =require("../model/userSchema");
const Member =require("../model/memberSchema");
const Receipt =require("../model/receiptSchema");
const Userauth =require("../model/userauth");
const Branch = require("../model/branchSchema")
const { ObjectId } = require('mongodb');
router.use(cookieParser());

//#################################################################################################################################################################################################################################################################################
//####################################################################################### data entry #######################################################################################################################################################################################

//####################################################################################### Employee Registeration #####################################################################################################################################################################################
//eid, name, gender,dob,contact,email,doj,address,physical,medical,position,center,photo,document,ecname1,ecname2,ecrelation1,ecrelation2,econtact1,econtact2
router.post('/Eform', async(req,res)=>{
    const {eid, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,position,centerlocation,Document,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,base64,file2 }=req.body;
    if(!eid || !name || !gender || !dob || !contact || !doj  || !address1 || !PhysicalCondition || !MedicalCondition || !position || !centerlocation  || !relation1 ||!relation2 || !econtact1 || !econtact2){
        return res.status(422).json({error:"Plz fill all the fields"})
    }
    try{

        const userExist= await User.findOne({eid:eid})
            if(userExist){
                return res.status(422).json({error:"Employee Id is registered"});
            }
            const latestReceipt = await User.findOne().sort({ id: -1 }).limit(1);
      const id = latestReceipt ? latestReceipt.id + 1 : 1;
            const user= new User({id,eid, name ,photo:base64 , document:file2 , gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,position,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2});
            const user1= await user.save();
            if(user1){
                res.status(201).json({message:"User registered successfully"});
            }else{ res.status(500).json({error: "Failed to register"})}
    }catch(err){console.log(err); };
})

//####################################################################################### Member Registeration ###################################################################################################################################################################################
router.post('/form',async(req,res)=>{
    const {membership, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,base64,file2,file3 }=req.body;
    if(!membership || !name ||  !gender || !dob || !contact || !email || !doj || !address1 || !PhysicalCondition || !MedicalCondition || !centerlocation  || !econtactn1 || !econtactn2 || !relation1 || !relation2 || !econtact1 || !econtact2){
        return res.status(422).json({error:"Plz fill all the fields"})
    }
    try{
    const userExist=await Member.findOne({membership:membership})
            if(userExist){
                return res.status(422).json({error:"Member Id is registered"});
            }
            const latestReceipt = await Member.findOne().sort({ id: -1 }).limit(1);
            const id = latestReceipt ? latestReceipt.id + 1 : 1;
            
            const user= new Member({id,membership,photo:base64 , fdocument:file2,bdocument:file3 , name , gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,receipt:[] });
            const User1= await user.save();
            if(User1){
                res.status(201).json({ message: "Member registered successfully", memberId: user._id });
            }else{ res.status(500).json({error: "Failed to register"})}
    }catch(err){console.log(err); };
});
//########################################################################################## Member Toggle ##########################################################################################################################################################
router.put(`/contacts1/:id`, async (req, res) => {
    const id = req.params.id;
    const { isActive } = req.body;
    
    try {
      const toggle = await Member.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isActive: isActive } }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "failed" });
    }
  });
//########################################################################################## Data Updation ##########################################################################################################################################################
//Member Data updation
router.put(`/eeform/:id`, async (req, res) => {
    const id = req.params.id;
  const updateData = req.body;
  try {
    const user = await Member.findByIdAndUpdate(id, updateData, { new: true });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
}); 
//Employee Data updation
router.put(`/etform/:id`, async (req, res) => {
    const id = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
//########################################################################################### Receipt form ##########################################################################################################################################################
router.post('/receipt', async (req, res) => {
    const { membershipno, pkg,ped, dop, fees } = req.body;
    if (!membershipno || !dop) {
      return res.status(422).json({ error: "Please fill all the required fields" });
    } 
    try {
      const userExist = await Member.findOne({ membership:membershipno });
      if (!userExist) {
        return res.status(422).json({ error: "Membership not found" });
      }
      const user = await userExist._id
      const latestReceipt = await Receipt.findOne().sort({ sno: -1 }).limit(1);
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const branchName =userExist.centerlocation
      const branch = await Branch.findOne({ ba: branchName });
      const branchCode = branch ? branch.bcode : '01'; // Use the branch code if found, or use a default value ('01') if not found
      let sno;
      if (latestReceipt) {
        const lastSno = parseInt(latestReceipt.sno.slice(-4), 10);  // Extract the last 4 digits of the sno
        sno = `${currentYear}${branchCode}${(lastSno + 1).toString().padStart(4, '0')}`;
    } else {
        sno = `${currentYear}${branchCode}0001`;
    }
    const latestReceipt1 = await Receipt.findOne().sort({ id: -1 }).limit(1);
      const id = latestReceipt1 ? latestReceipt.id + 1 : 1;
    const pd = ped ? ped : 0;
  
      const package = req.body.pkg;
      const repaymentInterval = package === 'Monthly' ? 1 : package === 'Quaterly' ? 3 : package === 'HalfYearly' ? 6 : 12;
      const dorp1 = moment().add(repaymentInterval, 'months').format('DD-MM-YYYY');
      const dorp= dorp1.toString();
  
      const receipt = new Receipt({user, id, pd,sno,pkg, membershipno, dop, dorp, fees });
      await receipt.save();
      userExist.receipt.push(receipt);
      await userExist.save();
  
      res.status(201).json({ message: "Receipt registered successfully", receiptId: receipt._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while saving the receipt" });
    }
  });

//########################################################################################### new Receipt form ##########################################################################################################################################################
router.post('/nreceipt', async (req, res) => {
  const { member, pkg,ped, dop, fees } = req.body;
  if (!member || !dop) {
    return res.status(422).json({ error: "Please fill all the required fields" });
  } 
  try {
    const userExist = await Member.findOne({ membership:member });
    if (!userExist) {
      return res.status(422).json({ error: "Membership not found" });
    }
    const user = await userExist._id
    const latestReceipt = await Receipt.findOne().sort({ sno: -1 }).limit(1);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const branchName =userExist.centerlocation
    const branch = await Branch.findOne({ ba: branchName });
    const branchCode = branch ? branch.bcode : '01'; // Use the branch code if found, or use a default value ('01') if not found
    let sno;
    if (latestReceipt) {
      const lastSno = parseInt(latestReceipt.sno.slice(-4), 10);  // Extract the last 4 digits of the sno
      sno = `${currentYear}${branchCode}${(lastSno + 1).toString().padStart(4, '0')}`;
  } else {
      sno = `${currentYear}${branchCode}0001`;
  }
  const latestReceipt1 = await Receipt.findOne().sort({ id: -1 }).limit(1);
    const id = latestReceipt1 ? latestReceipt.id + 1 : 1;
  const pd = ped ? ped : 0;

    const package = req.body.pkg;
    const repaymentInterval = package === 'Monthly' ? 1 : package === 'Quaterly' ? 3 : package === 'HalfYearly' ? 6 : 12;
    const dorp1 = moment().add(repaymentInterval, 'months').format('DD-MM-YYYY');
    const dorp= dorp1.toString();

    const receipt = new Receipt({user, id, pd,sno,pkg, membershipno:member, dop, dorp, fees });
    await receipt.save();
    userExist.receipt.push(receipt);
    await userExist.save();

    res.status(201).json({ message: "Receipt registered successfully", receiptId: receipt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while saving the receipt" });
  }
});

//################################################################################################ ADMIN #########################################################################################################################################################
router.post('/auth', async (req,res)=>{
    const {eid,password}=req.body;
    if(!eid || !password){
        return res.status(422).json({error:"Plz fill all the fields"})
    }
    try{
        const userExist1 =await User.findOne({eid:eid})
            if(userExist1){
                return res.status(422).json({error:"Member Id is registered"});
            }
        const userExist =await Userauth.findOne({eid:eid})
            if(userExist){
                return res.status(422).json({error:"Member Id is registered"});
            }
            const user= new Userauth({eid,password});
            await user.save();
            res.status(201).json({message:"Admin registered successfully"});
        } catch(err){
            console.log(err);
        }
})
//################################################################################################ Add Branch #########################################################################################################################################################
router.post('/branch', async (req, res) => {
    const { ba } = req.body;
    if (!ba) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    try {
      const latestReceipt = await Branch.findOne().sort({ sno: -1 }).limit(1);
      let bcode = '01';
  
      if (latestReceipt) {
        const lastBranchCode = latestReceipt.bcode;
        const numericCode = parseInt(lastBranchCode, 10);
  
        if (!isNaN(numericCode)) {
          const nextCode = numericCode + 1;
          bcode = nextCode.toString().padStart(2, '0');
        }
      }
  
      const user = new Branch({ ba, bcode });
      await user.save();
      res.status(201).json({ message: "Branch registered successfully" });
    } catch (err) {
      console.log(err);
    }
  });
    
//#########################################################################################################################################################################
//###################################################################### Login verification ##############################################################################

//login route

router.post('/',async (req,res)=>{
    try {
        const{eid,password} = req.body;
        if(!eid || !password){
            return res.status(400).json({error:"Invalid data"})
        }
        const userLogin = await Userauth.findOne({eid:eid});
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password)
            if (!isMatch) {
                res.status(400).json({error:"Invalid credientials"})
            } else {
            const token = await userLogin.generateAuthToken();
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now() + 18000000),
                httpOnly:true
            }); 
            res.json({message:"user signing succesfully"})
        }
    }else{
        res.status(400).json({error:"Invalid credientials"})
    }
    } catch (err) {
        console.log(err)       
    }
})
//#######################################################################################################################################################################################################################################################################################################
//################################################################################## DELETE Function ################################################################################################
router.delete('/delete/:id',async(req,res)=>{
    try {
        const data = await Member.findByIdAndDelete(req.params.id);
        if(data){
            res.json({message:'Data deleted successfully'});
        }else{
            res.status(404).json({message:'Data not found'});
        }
    } catch (err) {
        console.log(err)
    }
})
router.delete('/delete2/:id',async(req,res)=>{
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        if(data){
            res.json({message:'Data deleted successfully'});
        }else{
            res.status(404).json({message:'Data not found'});
        }
    } catch (err) {
        console.log(err)
    }
})
//#######################################################################################################################################################################################################################################################################################################
//################################################################################## GET DATA ################################################################################################

//#################################################################### Dashboard Page ######################################################################################################################################################

router.get('/dashboard',authenticate,(req,res)=>{
    res.send("hello world dashboard")
})

router.get("/protected", authenticate, (req, res) => {
    // Access the user information from req.user
    const userId = req.user.id;
  
    // Perform further actions based on the user's authorization
  
    res.json({ message: "Protected route accessed successfully" });
  });
//########################################################################################################### Employee Page ######################################################################################################################################################
router.get('/teams',authenticate,(req,res)=>{
    res.send(req.rootUser2);
})

//########################################################################################################### Member Page ######################################################################################################################################################
router.get('/contacts',authenticate,(req,res)=>{
    res.send(req.rootUser1);
})

//########################################################################################################## Member by id ######################################################################################################################################################
router.get('/econtact/:id',authenticate,(req,res)=>{
    res.send(req.rootUser8);
}) 
//########################################################################################################## user by id ######################################################################################################################################################
router.get('/eteams/:id',authenticate,(req,res)=>{
    res.send(req.rootUser9);
}) 

//####################################################################################################### Defaulter page ######################################################################################################################################################
router.get('/balance',authenticate,(req,res)=>{
    res.send(req.rootUser7)
})

//##################################################################################################### Receipt page ######################################################################################################################################################
router.get('/receipts',authenticate,(req,res)=>{
    res.send(req.rootUser3)
})
//##################################################################################################### Branch page ######################################################################################################################################################
router.get('/b',authenticate,(req,res)=>{
    res.send(req.rootUser12)
})

//##################################################################################################### Receipt by id ######################################################################################################################################################
router.get(`/preceipt/:id`,authenticate,(req,res)=>{
    res.send(req.rootUser4)
})
router.get('/count',authenticate,(req,res)=>{
    res.send({count: res.locals.rootUser5})
})

router.get('/count1',authenticate,(req,res)=>{
    res.send({count: res.locals.rootUser6})
})

//################################################################################################### Logout page ######################################################################################################################################################
router.get('/logout',(req,res)=>{
    console.log("hello my logout page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User Logout')
})

module.exports= router;  
