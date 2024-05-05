import express from 'express'
import prisma from "../db/index.js";
import llamaAPI from "../llama/index.js"
const router = express.Router()

export default function(authMiddleware){

        router.get("/",async (req,res)=>{
            let topics = await prisma.topic.findMany()
            res.json(topics)
           
        })
        router.post("/",authMiddleware, async (req,res)=>{
            const {topicId} = res.body

            const quiz = await prisma.quiz.create({data:{
                topic:{
                    connect:{
                        id: topicId
                    }
                }
            }})
            res.json(quiz)
        })
        router.post("/:id/join",authMiddleware, async (req,res)=>{

                const id = req.params.id
                const userQuiz = await prisma.userQuiz.create({data:{
                    user: {
                        connect:{
                            id: req.user.id
                        }
                    },
                    quiz:{
                        connect:{
                            id: id
                        }
                    }

                }})
                res.json(userQuiz)

        })
        router.post("/:id/user",authMiddleware,async (req,res)=>{
            const id= req.params.id
            const userId =req.user.id



        })


    return router
}
