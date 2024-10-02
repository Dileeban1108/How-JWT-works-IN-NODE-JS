const express=require('express')
const router=express.Router()
const regiterController=require('../controllers/registerController')

router.post('/studentRegister',regiterController.handleNewUser)

module.exports=router