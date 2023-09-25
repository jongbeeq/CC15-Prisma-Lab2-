const express = require('express')
const createError = require('../utils/create-error');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const router = express.Router()


router.post('/login',async (req,res,next) => {
    try {
        const {username,password} = req.body;
        // const result = await db.query('select * from users where username=? and password=?',[username,password])
        const result =  await prisma.users.findMany({
            where: {
                AND: [
                {username: username},
                {password: password}
                ]
                // username: username
            }
            
        })
        console.log(result)
        if(result.length === 0){
        //    return res.status(400).json({message: "invalid username or password"})
        console.log('err')
           return next(createError(400,"invalid username or password"))
        }
        
        res.status(200).json('success login')
        
    } catch(err) {
        // res.status(500).json({message: 'internal server error'})
        next(createError(500,'internal server error'))
    }
});


router.post('/register',async (req,res,next) =>{
    try {
         // read body
        const {username,password} = req.body;

        // const result = await db.query('select * from users where username = ?', [username])// [[],[]]
        const searchUser = await prisma.users.findUnique({
            where: {
                username: username
            }
        })
        console.log("Have user:" + searchUser)
        if(searchUser !== null) {
            return next(createError(400,'username already in use'))
        }
        // VALIDATE FAIL
        // res.status(400).json({message: 'PASSWORD must contain at least one uppercase'})

        // await db.query('insert into users (username,password) values(?,?)',[username,password])
        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: password
            }
        })
        console.log(newUser)
        res.status(201).json({message: 'Success Registration'});
    } catch(err) {
        // res.status(500).json({message: 'Internal server error'})
        next(createError(500,'Internal server error'))
    }
});


router.put('/change-password',async (req,res,next) => {
    try {
        const {username,newPassword} = req.body

    //    const result = await db.query('select * from users where username=?',[username])
        const result = await prisma.users.findUnique({
            where: {
                username: username
            }
        })
       if(result === null) {
        next(createError(400,'username not found'))
       }
    //    await db.query('update users set password=? where username=?',[newPassword,username])
       const userNewPassword = await prisma.users.update({
        data:{
            password: newPassword
        },
        where:{
            username: username
        }
        })
        console.log(userNewPassword)
       res.status(200).json({message: 'success update password'})
    } catch(err) {
        // res.status(500).json({message: 'internal server error'})
        next(createError(500,'Internal server error'))
    }
})

module.exports = router;