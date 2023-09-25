const { PrismaClient} = require('@prisma/client');
const express = require('express');
const errorMiddleware = require('./middleware/error')
const userRoute = require('./routes/user-route')
const todoRoute = require('./routes/todo-route')
const app = express();

const prisma = new PrismaClient()

const run = async () => {
    // const result =  await prisma.users.findMany({
    //     where: {
    //         // id: 2
    //         AND: [
    //         {username: "caat"},
    //         {password: "5555"}
    //         ]
    //     }
    // })

    // const result = await prisma.users.create({
    //     data: {
    //         username: "dog",
    //         password: "99999"
    //     }
    // })

    // const result = await prisma.users.update({
    //     data:{
    //         password: "cat"
    //     },
    //     where:{
    //         username: "cat"
    //     }
    //     })

    // const result = await prisma.todos.findMany({
    //     where:{
    //         AND: [{user_id: 1},{title: "Swim"}]
    //     }
    // })
    // console.log(result)
}

run()

app.use(express.json())
// console.log(express.json())

app.use('/user', userRoute)

app.use('/todo', todoRoute)

app.use(errorMiddleware)

app.listen(8888 , () => console.log('server running on port 8888'))