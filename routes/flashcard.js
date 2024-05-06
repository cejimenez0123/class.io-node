import express from 'express'
import prisma from "../db/index.js";
import llamaAPI from '../llama/index.js';
import apiRequests from './apiRequests.js';
const router = express.Router()

export default function(authMiddleware){
        function parseFrontBack(response){
            let content = response["choices"][0].message.content
            
            let list = content.split("\n").filter(e=>e!="")
let answer= list[list.findIndex(e=>/"([^"]+)"/.test(e))].split(" ")
const front = answer[answer.length-1]
// console.log(list)
const back = list[list.findIndex(e=>e.toLowerCase().includes("definition: "))])
            return {front,back}
        }
     
        router.post("/topic/:id", async (req, res) => {
            let request = apiRequests['66352d583acf32f3f108c9ae'].flashcards()
            let id = req.params.id
            let response = await llamaAPI.run(request)
            const {front,back} =parseFrontBack(response)
            const flashcard = await  prisma.flashcard.create({data:{
                        front:front,
                        back:back,
                        topic:{
                            connect:{
                            id:id
                            }
                        }
                }})
            res.json(flashcard)
        })

    return router
}
