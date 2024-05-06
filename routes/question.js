import express from 'express'
import prisma from "../db/index.js";
import llamaAPI from "../llama/index.js"
import { connect } from 'http2';
import apiRequests from './apiRequests.js';
const router = express.Router()
function parseCorrectAnswer(responseAnswer){   
    let answerContent = responseAnswer.choices[0].message.content
    const regexAmp = /(?:@)?[a-zA-Z]\)/gm
    let splitAnswer = answerContent.split(regexAmp)
    
    return splitAnswer[splitAnswer.length-1]
    
}
function parseQuestionAndAnswer(responseQuestion){
 
    let text=  responseQuestion.choices[0].message.content
    const splitQuestion= text.split("\n").slice(2,text.split("\n").length-1)
   
       let filtered  =splitQuestion.filter(e=>e!='')
       const question = filtered.slice(0,2).join(" ")
        const answers =filtered.slice(filtered.length-4,filtered.length).filter(e=>e!='')
    
        
    return {question,answers}
}
export default function(authMiddleware){


    router.get("/topic/:id/quiz/:quizId/:count",async (req,res)=>{
        try{
                const questionRequest = apiRequests[req.params.id].jsonQuestion(req.params.count)
            
                let response = await llamaAPI.run(questionRequest)
                let jsonRes = JSON.parse(response.choices[0].message.content)
                
               if(jsonRes.length>1){
       
                  let questionsAnswers = jsonRes.map(async (json) => {
                    let question = await prisma.question.create({
                        data: {
                          topic: {
                            connect: {
                              id: req.params.id,
                            },
                          },
                          content: json.question,
                          difficulty: 1,
                          correctAnswer: json.correct,
                        },
                      });
                      
                    const answers = json.answers.map((answer) => {
                  
                        return prisma.answer.create({
                          data: {
                            content: answer,
                            question: {
                              connect: { id: question.id },
                            },
                          },
                      });
                    })

                    const responseAnswers = await Promise.all(answers);
            
                    return { question, answers: responseAnswers };
                });
               
                  let resBody = await Promise.all(questionsAnswers);
                  
                  res.json(resBody);
   
        
        }else{
            let json = JSON.parse(response.choices[0].message.content)
            let question = await prisma.question.create({data:{
                topic:{
                    connect:{
                        id: req.params.id,
                    }
                },
                content: json.question,
                difficulty: 1,
                correctAnswer: json.correct,
            }})
            await prisma.quizQuestion.create({data:{
                question:{
                    connect:
                        {id:question.id}
                    },
                quiz:{connect:{id:req.params.quizId}}}})
                const answers = json.answers.map(async answer=>{
                    // let noLetterAnswer = answer.split(" ").slice(1,answer.split(" ").length).join(" ")
                    return prisma.answer.create({data:{
                        content:answer,
                        question:{
                            connect: {id:question.id}
                        }
                    }})
                   })
                   let responseAnswers = await Promise.all(answers)

                 res.json([{question,answers:responseAnswers}])
        }   
            } catch (error) {
                console.error(`Error creating answer: ${error}`);
                throw error; 
              }

})
    
    return router
}


