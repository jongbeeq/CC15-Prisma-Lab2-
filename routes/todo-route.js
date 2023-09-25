const express = require('express')
const createError = require('../utils/create-error')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const router = express.Router()


router.post('/create-todo',async (req,res,next) => {
    try {
        // Read Body
        const {title,userId,completed} = req.body
        // Validate
        // const result = await db.query('select * from users where id = ?',[userId])
        const result = await prisma.users.findUnique({
            where:{
                id: userId
            }
        })
        console.log(result)
        if(result === null) {
            // return res.status(400).json({message: 'user with this id not found'})
            return next(createError(400,'user with this id not found'))
        }
        // await db.query('insert into todos (title,completed,user_id) values (?,?,?)',[title,completed,userId])
        const todo = await prisma.todos.create({
            data:{
                title: title,
                completed: completed,
                user_id: userId
            }
        })
        res.status(200).json({message: 'created todo successfully'});
    } catch(err) {
        next(createError(500,'internal server error'))
    }
})


router.get('/get-todo',async (req,res,next) => {
    try {
        const {searchTitle, userId} = req.query;
        if(searchTitle !== undefined && userId !== undefined){
            // const result = await db.query('select * from todos where title=? and user_id=?',[searchTitle,userId])
            const result = await prisma.todos.findMany({
                where:{
                    AND: [{user_id: +userId},{title: searchTitle}]
                }
            })
            console.log(result)
            return res.status(200).json({resultTodo: result})
        }
        if(searchTitle !== undefined){
            // const result = await db.query('select * from todos where title=?',[searchTitle])
            const result = await prisma.todos.findMany({
                where:{
                    title: searchTitle
                }
            })
            console.log(result)
            return res.status(200).json({resultTodo: result})
        }
        if(userId !== undefined){
            // const result = await db.query('select * from todos where user_id=?',[userId])
            const result = await prisma.todos.findMany({
                where:{
                 user_id: +userId   
                }   
            })
            console.log(result)
            return res.status(200).json({resultTodo: result})
        }

        // const result = await db.query('select* from todos')
        const result = await prisma.todos.findMany()
        console.log(result)
        res.status(200).json({resultTodo: result});
    } catch(err) {
        next(createError(500,'internal server error'))
    }
})


router.delete('/delete-todo/:idToDelete', async (req,res,next) =>{
    try {
        // READ PATH PARAMETER
        const {idToDelete} = req.params // {idToDelete: value}
        // find todo exist
        // const result = await db.query('select * from todos where id = ?',[idToDelete])
        const havId = await prisma.todos.findMany({
            where:{
                id: +idToDelete
            }
        })
        console.log(havId)
        if(havId.length === 0) {
            // return res.status(400).json({message: 'todo with this id not found'})
            return next(createError(400,'todo with this id not found'))
        }
        // await db.query('delete from todos where id = ?',[idToDelete])
        const result = await prisma.todos.delete({
            where:{
                id: +idToDelete
            }
        })
        res.status(200).json({message: 'delete succesfully'})
    } catch(err) {
        // res.status(500).json({message: 'Internal server error'})
        next(createError(500,'internal server error'))
    }
})


module.exports = router;