import express from 'express'
import prisma from "../db/index.js";
import llamaAPI from "../llama/index.js"
import { connect } from 'http2';
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
    // const regex = /\d+\./;
    // let i = splitQuestion.filter(exp=>{
    //     return regex.test(exp)})
    // const indices = i.map(t=>splitQuestion.findIndex(i=>i==t))
    // for(let i=0;i<indices.length ; i++){
        // const arr = splitQuestion.slice(indices[i],indices[i]+8)
        // let question = splitQuestion.filter(e=>e!="").slice(0,3).join(" ")
    //    let answers =splitQuestion.slice(4,splitQuestion.length)
       let filtered  =splitQuestion.filter(e=>e!='')
       const question = filtered.slice(0,2).join(" ")
        const answers =filtered.slice(filtered.length-4,filtered.length).filter(e=>e!='')
        // let question = arr.slice(0,2).join(" ").split(" ").slice(1,arr.length-1).join(" ")
        // let answers =arr.slice(4,arr.length)  
        
    return {question,answers}
}
export default function(authMiddleware){


    router.get("/topic/:id/:count",async (req,res)=>{
        try{
                const questionRequest = apiRequests[req.params.id].question(req.params.count)
                let response = await llamaAPI.run(questionRequest)
                const questionAnswer = parseQuestionAndAnswer(response)
                console.log(questionAnswer)
                let answerRequest = apiRequests[req.params.id].answer(questionAnswer.question,questionAnswer.answers)
             
                const resAns = await llamaAPI.run(answerRequest).catch(error=>{
                    console.error(error)
                    throw new Error({source:"AnswerRequest",error:error})
                })
                const finalAnswer = parseCorrectAnswer(resAns)
                const question = await prisma.question.create({data:{
                    topic:{
                        connect:{
                            id: req.params.id,
                        }
                    },
                    content: questionAnswer.question,
                    difficulty: 1,
                    correctAnswer: finalAnswer,
                }})
               const answers = questionAnswer.answers.map(async answer=>{
                let noLetterAnswer = answer.split(" ").slice(1,answer.split(" ").length).join(" ")
                return prisma.answer.create({data:{
                    content:noLetterAnswer,
                    question:{
                        connect: {id:question.id}
                    }
                }})
               })
               let responseAnswers = await Promise.all(answers)
               console.log(responseAnswers)
                res.json({question,answer:responseAnswers})
            } catch (error) {
                console.error(`Error creating answer: ${error}`);
                throw error; 
              }

})
    
    return router
}

let apiRequests = {
    "66352d583acf32f3f108c9ae" : {

        question:(count)=>{
          
            return{
                'model':"llama2-13b-chat",
        "messages": [
          { "role": "user", 
          "content": `Generate a high school algebra question$ in a multiple-choice format with four answer options. That is random` }
        ],
        "function_call": "get_math_questions"
    }},
       answer:(question,answers)=>{return {'model':"llama2-13b-chat",
   "messages": [
    
        { "role":"user", "content":"What is the answer to " + question +  " based on given choices seen here " +answers.join(" ")
        + "is it a ,b,c, or d and place answer after an @? Do not make me guess, do not explain"}
      
    ],
    "function_call": "answer_math_questions"
   }
    }}
}
