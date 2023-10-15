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
    const {eid, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,position,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,photo,fdocument,bdocument }=req.body;
    if(!eid || !name || !gender || !dob || !contact || !doj  || !address1 || !PhysicalCondition || !MedicalCondition || !position || !centerlocation  || !relation1  || !econtact1 ){
        return res.status(422).json({error:"Plz fill all the fields"})
    }
    try{

        const userExist= await User.findOne({eid:eid})
            if(userExist){
                return res.status(422).json({error:"Employee Id is registered"});
            }
            const latestReceipt = await User.findOne().sort({ id: -1 }).limit(1);
      const id = latestReceipt ? latestReceipt.id + 1 : 1;
            const user= new User({id,eid, name ,photo , fdocument,bdocument , gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,position,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2});
            const user1= await user.save();
            if(user1){
                res.status(201).json({message:"User registered successfully",memberId: user._id});
            }else{ res.status(500).json({error: "Failed to register"})}
    }catch(err){console.log(err); };
})
//#################################################################################################################################################################################################






//####################################################################################### Member Registeration ###################################################################################################################################################################################
router.post('/form',async(req,res)=>{
    const {membership, name, gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,photo,fdocument,bdocument }=req.body;
    if(!membership || !name ||  !gender || !dob || !contact  || !doj || !address1 || !PhysicalCondition || !MedicalCondition || !centerlocation  || !econtactn1  || !relation1 ||  !econtact1 ){
        return res.status(422).json({error:"Plz fill all the fields"})
    }
    try{
    const userExist=await Member.findOne({membership:membership})
            if(userExist){
                return res.status(422).json({error:"Member Id is registered"});
            }
            const latestReceipt = await Member.findOne().sort({ id: -1 }).limit(1);
            const id = latestReceipt ? latestReceipt.id + 1 : 1;
            
            const user= new Member({id,membership,photo , fdocument,bdocument , name , gender,dob,contact,email,doj,address1,PhysicalCondition,MedicalCondition,centerlocation,econtactn1,econtactn2,relation1,relation2,econtact1,econtact2,receipt:[] });
            const User1= await user.save();
            if(User1){
                res.status(201).json({ message: "Member registered successfully", memberId: user._id });
            }else{ res.status(500).json({error: "Failed to register"})}
    }catch(err){console.log(err); };
});
//######################################################################################################################################################################################################################################################################################







//########################################################################################### Receipt form ##########################################################################################################################################################
router.post('/receipt', async (req, res) => {
  const { membershipno, serial, ped, dop, fees ,packagestart,paymentM} = req.body;
  if (!membershipno || !dop) {
    return res.status(422).json({ error: "Please fill all the required fields" });
  } 
  try {
    const userExist = await Member.findOne({ membership: membershipno });
    const user = userExist._id;
    if (!userExist) {
      return res.status(422).json({ error: "Membership not found" });
    }
    switch (fees) {
      case "700":
      case "800":
      case "1000":
        pkg = "Monthly";
        break;
      case "2300":
      case "2100":
        pkg = "Quaterly";
        break;
      case "4000":
      case "3800":
        pkg = "Half Yearly";
        break;
      case "7000":
      case "7200":
        pkg = "Yearly";
        break;
      default:
        return res.status(422).json({ error: "Invalid fees value" });
    }
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const branchName = userExist.centerlocation;
    const branch = await Branch.findOne({ba:branchName})// Replace 'branch1' and 'branch2' with your actual branch names or codes
    const branchCode = branch ? branch.bcode : '01'; // Use the branch code if found, or use a default value ('01') if not found
    const latestReceipt = await Receipt.findOne({ isSystemGenerated: true }).sort({ sno: -1 }).limit(1);
    const latestReceipt1 = await Receipt.findOne().sort({ id: -1 }).limit(1);
    let sno;
    let id;
    let isSystemGenerated = false; // Initialize the flag for system-generated receipt
    if (serial) {
      // Check if the client-provided serial number matches any existing receipt
      const existingReceipt = await Receipt.findOne({ sno: serial });
      if (existingReceipt) {
        // The client-provided serial number already exists, so it's not system-generated
        res.status(500).json({ error: "Serial no already exist" });
      } else {
        sno = serial;
        id = latestReceipt1 ? latestReceipt1.id + 1 : 1;
      }
    } else {
      if (latestReceipt) {
        const lastSno = parseInt(latestReceipt.sno.slice(-4), 10);  // Extract the last 4 digits of the sno
        sno = `${currentYear}${branchCode}${(lastSno + 1).toString().padStart(4, '0')}`;
        isSystemGenerated = true; // The generated serial number is system-generated
        id = latestReceipt1 ? latestReceipt1.id + 1 : 1;
      } else {
        sno = `${currentYear}${branchCode}0001`;
        id = latestReceipt1 ? latestReceipt1.id + 1 : 1;
         isSystemGenerated = true;
      }
    }
    let p;
    let calculatedps;
    const pd = ped ? ped : 0;
    const repaymentInterval = pkg === 'Monthly' ? 1 : pkg === 'Quaterly' ? 3 : pkg === 'Half Yearly' ? 6 : 12;

    const currentMonth = moment().format('MM'); // Get the current month (two-digit)
    const currentyear = moment().format('YYYY'); 
    if (userExist.receipt.length === 0) {
      // If this is the first receipt for the member, set package start date to their date of joining (doj)
      const joining = moment(userExist.doj, 'DD-MM-YYYY');
        const packageStartDay = joining.format('DD');
        p = `${packageStartDay}-${currentMonth}-${currentyear}`; // Assuming 'doj' is the date of joining property in the Member model
      } else {
        const lastReceiptId = userExist.receipt[userExist.receipt.length - 1]; // Get the ObjectId of the last receipt
        const lastReceipt = await Receipt.findById(lastReceiptId); // Fetch the last receipt using its ObjectId
        if (lastReceipt) {
          const lastDorpDate = moment(lastReceipt.dorp, 'DD-MM-YYYY');
          const packageStartDay = lastDorpDate.format('DD');
          p = `${packageStartDay}-${currentMonth}-${currentyear}`;
        }}
    if (packagestart) {
      calculatedps = packagestart;
    } else {
      // Use the 'p' value calculated based on the last 'dorp'
      calculatedps = p;
    }
    
    const dorp1 = moment(calculatedps, 'DD-MM-YYYY').add(repaymentInterval, 'months').format('DD-MM-YYYY');
    const dorp = dorp1.toString();
    
    // Save the receipt with the isSystemGenerated flag
    
    const receipt = new Receipt({ user, id, pd, sno, pkg, membershipno, calculatedps,dop, dorp,paymentM, fees, isSystemGenerated });
    await receipt.save();
    userExist.receipt.push(receipt);
    await userExist.save();
    res.status(201).json({ message: "Receipt registered successfully", receiptId: receipt._id });
  } 
  catch (err) {
    res.status(500).json({ error: "An error occurred while saving the receipt" });
    console.error(err)
}});    
//####################################################################################################################################################################################################################################################################################







//########################################################################################### new Receipt form ##########################################################################################################################################################
router.post('/nreceipt', async (req, res) => {
  const { member,ped, dop, fees ,packagestart,paymentM} = req.body;
  if (!member || !dop) {
    return res.status(422).json({ error: "Please fill all the required fields" });
  } 
  try {
    const userExist = await Member.findOne({ membership:member });
    if (!userExist) {
      return res.status(422).json({ error: "Membership not found" });
    }
    switch (fees) {
      case "1000":
        pkg = "Monthly";
        break;
      case "2300":
        pkg = "Quaterly";
        break;
      case "4000":
        pkg = "Half Yearly";
        break;
      case "7200":
        pkg = "Yearly";
        break;
      default:
        return res.status(422).json({ error: "Invalid fees value" });
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

    const repaymentInterval = pkg === 'Monthly' ? 1 : pkg === 'Quaterly' ? 3 : pkg === 'Half Yearly' ? 6 : 12;

    const currentMonth = moment().format('MM'); // Get the current month (two-digit)
    const currentyear = moment().format('YYYY'); 
    if (userExist.receipt.length === 0) {
      // If this is the first receipt for the member, set package start date to their date of joining (doj)
      const joining = moment(userExist.doj, 'DD-MM-YYYY');
        const packageStartDay = joining.format('DD');
        p = `${packageStartDay}-${currentMonth}-${currentyear}`; // Assuming 'doj' is the date of joining property in the Member model
      } else {
        const lastReceiptId = userExist.receipt[userExist.receipt.length - 1]; // Get the ObjectId of the last receipt
        const lastReceipt = await Receipt.findById(lastReceiptId); // Fetch the last receipt using its ObjectId
        if (lastReceipt) {
          const lastDorpDate = moment(lastReceipt.dorp, 'DD-MM-YYYY');
          const packageStartDay = lastDorpDate.format('DD');
          p = `${packageStartDay}-${currentMonth}-${currentyear}`;
        }}
    if (packagestart) {
      calculatedps = packagestart;
    } else {
      // Use the 'p' value calculated based on the last 'dorp'
      calculatedps = p;
    }
    
    const dorp1 = moment(calculatedps, 'DD-MM-YYYY').add(repaymentInterval, 'months').format('DD-MM-YYYY');
    const dorp = dorp1.toString();
    
    const receipt = new Receipt({user, id, pd,sno,pkg, membershipno:member,paymentM,calculatedps, packagestart,dop, dorp, fees });
    await receipt.save();
    userExist.receipt.push(receipt);
    await userExist.save();

    res.status(201).json({ message: "Receipt registered successfully", receiptId: receipt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while saving the receipt" });
  }
});
//####################################################################################################################################################################################################################################################################################






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
//################################################################################################################################################################################################################################################################################






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
//###################################################################################################################################################################################################################################



//##################################################################################### Data entry ends ####################################################################################
//#########################################################################################################################################################################










//########################################################### Update Data using Toggle Button ###########################################################################################################################################################################
//########################################################################################## Member Toggle ##########################################################################################################################################################
/*router.put(`/contacts1/:id`, async (req, res) => {
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
});*/
router.put("/contacts1/:id", async (req, res) => {
  const id = req.params.id;
  const { isActive, version } = req.body;

  try {
    // Fetch the current member data including the version number
    const existingMember = await Member.findById(id);

    if (!existingMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (existingMember.version !== version) {
      return res.status(409).json({ message: "Concurrency conflict" });
    }

    // Increment the version before updating to avoid conflicts in subsequent updates
    existingMember.version++;
    existingMember.isActive = isActive;

    // Save the updated member data
    await existingMember.save();

    res.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

//################################################################  Update Data using Toggle Button Ends ##################################################################################################################################################################################################









//########################################################################################## Data Updation ##########################################################################################################################################################
//####################################################################################### Member Data updation ########################################################################################################################################
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
//###################################################################################### Employee Data updation #######################################################################################################################
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
//#################################################################################  Extend the Dorp date ####################################################################################################
router.put(`/receipt1/:id`, async (req, res) => {
  const id = req.params.id;
const updateData = req.body;
try {
  const user = await Receipt.findByIdAndUpdate(id, updateData, { new: true });
  res.send(user);
} catch (err) {
  res.status(500).send(err);
}
});
//####################################################### Update DAta Ends############################################################################################################################################
//#########################################################################################################################################################################













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
//########################################################################################### Login verification ends ##################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################










//#######################################################################################################################################################################################################################################################################################################
//################################################################################## DELETE Function ################################################################################################
router.delete('/delete/:id', async (req, res) => {
  try {
    // Step 1: Delete the member from the "member" collection
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Step 2: Delete all receipts that reference the deleted member
    const deletedReceipts = await Receipt.deleteMany({ user: req.params.id });

    res.json({ message: 'Member and associated receipts deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
router.delete('/delete3/:id', async (req, res) => {
  try {
    // Step 1: Delete the receipt from the "receipt" collection
    const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);

    if (!deletedReceipt) {
      return res.status(404).json({ message: 'Data not found' });
    }

    const memberId = deletedReceipt.user; 

    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { $pull: { receipt: req.params.id } },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//#################################################################################### Delete Data ends#########################################################################################################
//##########################################################################################################################################################################################################












//#######################################################################################################################################################################################################################################################################################################
//################################################################################## GET DATA ################################################################################################


router.get("/protected", authenticate, (req, res) => {
    // Access the user information from req.user
    const userId = req.user.id;
  
    // Perform further actions based on the user's authorization
  
    res.json({ message: "Protected route accessed successfully" });
  });
//########################################################################################################### Employee Page ######################################################################################################################################################
router.get('/teams1',authenticate,(req,res)=>{
    res.send(req.rootUser2);
})

//########################################################################################################### Member Page ######################################################################################################################################################
router.get('/contacts1',authenticate,(req,res)=>{
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
router.get('/balance1',authenticate,(req,res)=>{
    res.send(req.rootUser7)
})

//##################################################################################################### Receipt page ######################################################################################################################################################
router.get('/receipts1',authenticate,(req,res)=>{
    res.send(req.rootUser3)
})
//##################################################################################################### Branch page ######################################################################################################################################################
router.get('/b',authenticate,(req,res)=>{
    res.send(req.rootUser12)
})

//##################################################################################################### Receipt by id ######################################################################################################################################################
router.get(`/preceipt1/:id`,authenticate,(req,res)=>{
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
//############################################# Get Date ends###################################################################################################################################################
module.exports= router;  
