const apiRequests = {
    "66352d583acf32f3f108c9ae" : {
        jsonQuestion:(count)=>{
            let plural = ""
            if(count>1){
                plural = "s"
            }
            return{
    'model':"llama2-13b-chat",
    "messages": [
        { "role": "user", 
        "content": `Generate novel ${count} high school algebra question${plural} in a multiple-choice format with four answer options. Structure the question and answers as json where the answers are in an array and the question is an attribute in json and the correct answer is an attribute. Only return the JSON, no pleasantries.`}
        ],
    "function_call": "generate_math_question_json"
    }}
        ,
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
    },
flashcards:()=>{return{"model": "llama2-13b-chat",
"messages": [
  {
    "role": "user",
    "content": "Please provide me with a quiz word from highschool algebra and its definition"
  }
],
"function_call": "create_math_flashcards"
}}}
}
export default apiRequests