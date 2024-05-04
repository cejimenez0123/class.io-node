import LlamaApi from "llamaai"

const llamaAPI = new LlamaApi("LL-nKsgccRWk2dILvQgrhl1LZPNo955pfk6iGJQSOTACfyKIs2SgKCXT1U5mxqX9Y5v")
// Build the Request
const apiRequestJson = {

    // "functions": [
    //     {
    //         "name": "generate_math_questions",
    //         "description": "Generate a high school algebra question in a multiple-choice format with four answer options.",
    //     }
    // ],
    
        "messages": [
          { "role": "user", 
          "content": "Generate a high school algebra question in a multiple-choice format with four answer options." }
        ],
        "function_call": "get_math_questions"
    }
 
  llamaAPI.run(apiRequestJson)
      .then(response => {
    console.log(JSON.stringify(response))
    let text=  response.choices[0].message.content
   const splitQuestion= text.split("\n").slice(2,text.split("\n").length-1)
   const regex = /\d+\./;
//    let i = splitQuestion.filter(exp=>{
//        return regex.test(exp)})
//    const indices = i.map(t=>splitQuestion.findIndex(i=>i==t))
//    for(let i=0;i<indices.length ; i++){
//        const arr = splitQuestion.slice(indices[i],indices[i]+8)
       let question = splitQuestion.slice(0,3).join(" ")
       let answers =splitQuestion.slice(4,splitQuestion.length)
       console.log(splitQuestion)
        console.log(question)
        console.log(answers)
    let requestJson = {
   
        "messages": [
      { "role": "user", "content":"What is the answer to " + question +  " based on given choices seen here " +answers.join(" ")
    + "is it a ,b,c, or d and place answer after an @?No pleasantries"}
    ],
    "function_call": "answer_math_questions"
   };
}).catch(err=>console.log(err))
       
//        let answerRequest = apiRequests["66352d583acf32f3f108c9ae"].answer(question,answers)
//        llamaAPI.run(answerRequest).then(resAns=>{
       
//        let answerContent = resAns.choices[0].message.content
      
//        const splitAns= answerContent.split(/[a-zA-Z]\)/gm)
//        console.log("$%")
//     const regexAmp = /(?:@)?[a-zA-Z]\)/gm
      
//        let inde = splitAns.findIndex(t=>t.match(regexAmp))
 
//        if(inde){
//        let ans = splitAns[0]
//         // let finalAnswer = ans.slice(inde+2,ans.length-1)
//         console.log(question)
//         console.log(answers)
//         let splitAnswer = answerContent.split(regexAmp)
//         console.log(splitAnswer[splitAnswer.length-1])
        
//        } 
//    })
   
//       }}).catch(error => {
      
//         console.error(error)
//       })
//       .catch(error => {
      
//         console.error(error)
//       });
//       let apiRequests = {
//         "66352d583acf32f3f108c9ae" : {
//             question:{
//             "messages": [
//               { "role": "user", 
//               "content": "Generate a high school algebra question in a multiple-choice format with four answer options." }
//             ],
//             "function_call": "get_math_questions"
//         },
//            answer:(question,answers)=>{return {
//        "messages": [
//           { "role":"user", "content":"What is the answer to" + question +  " based on given choices seen here " +answers.join(" ")
//           + "is it a ,b,c, or d and place answer after an @? Do not make me guess, do not explain"}
//         ],
//         "function_call": "answer_math_questions"
//        }
//         }}}
 export default llamaAPI