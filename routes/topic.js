import express from 'express'
import prisma from "../db/index.js";

const router = express.Router()
export default function(authMiddleware){
        router.get("/",async (req,res)=>{
            let topics = await prisma.topic.findMany()
            res.json(topics)
           
        })
        router.get("/find/:id",async (req,res)=>{
            let id = req.params.id
            console.log(id)
            let topic = await prisma.topic.findFirst({where:{
                id:id}})
            res.json(topic)
        })
        router.post("/:id/user",authMiddleware,async (req,res)=>{
            const id= req.params.id
            const userId =req.user.id
            const userTopic = await prisma.userTopic.create({data:{
    user:{
        
        connect: {
            id:userId
        }
    },
    topic:{
        connect:{
            id: id
    }}
} })
res.json(userTopic)
        })
        router.get("/user/:id",authMiddleware,async (req,res)=>{

            let topics = await prisma.userTopic.findMany({where: {userId:req.user.id},include:{topic:true}})
            res.json(topics)
        })
        router.get("/:id/user/",authMiddleware,async (req,res)=>{
            const user = await prisma.userTopic.findMany({where:{
                topic:{
                    id: req.params.id
                }
                
            },include:{user:true}})

            res.json(user)
        })
    return router
}
