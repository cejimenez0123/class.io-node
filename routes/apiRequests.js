let apiRequests = {
    "66352d583acf32f3f108c9ae" : {

        question:()=>{
          
            return{
                'model':"llama2-13b-chat",
        "messages": [
          { "role": "user", 
          "content": `Generate a high school algebra question in a multiple-choice format with four answer options. That is random` }
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
export default apiRequests