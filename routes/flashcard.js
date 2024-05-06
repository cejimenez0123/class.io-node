import express from 'express'
import prisma from "../db/index.js";
import llamaAPI from '../llama/index.js';
import apiRequests from './apiRequests.js';
const router = express.Router()

export default function(authMiddleware){

     
        router.post("/topic/:id/count/:count", async (req, res) => {
            let id = req.params.id
            let count = req.params.count
            let request = apiRequests[id].flashcards(count)
            
            let response = await llamaAPI.run(request)
            let jsonStr = response.choices[0].message.content
            let json = JSON.parse(jsonStr)
            if(json.length>1){
                let flashPromise = json.map(flash=>{

                    return prisma.flashcard.create({data:{
                      front: flash.front,
                      back : flash.back,
                      topic:{
                        connect:{
                            id: id
                        }
                      }
                    }})
                })
                const flashcards = await Promise.all(flashPromise)
                
                res.json(flashcards)

            }else{

          

            
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
        }
        })

    return router
}
