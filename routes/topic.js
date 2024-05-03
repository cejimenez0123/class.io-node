const express = require('express');
const prisma = require("../db");

const router = express.Router()

module.exports = function(authMiddleware){

        router.get("/",async (req,res)=>{
            let topics = await prisma.topic.findMany()
            res.json(topics)
           
        })
        router.post("/:id/user",authMiddleware,async (req,res)=>{
            const topic = req.params.id
            const userTopic = await prisma.userTopic.create({data:{
    user:{
        connect: req.user.id
    },
    topic:{
        connect:id
    }
} })
        })
        router.get("/:id/user/",authMiddleware,async (req,res)=>{
            const user = await prisma.userTopic.findMany({where:{
                topic:{
                    id: req.params.id
                },
                include:{
                    user: true
                }
                
            }})

            res.json(user)
        })
    
    return router
}
