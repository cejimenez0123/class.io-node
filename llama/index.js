import LlamaApi from "llamaai"
//  const llamaAPI = new LlamaApi(process.env.LLAMA_API)
const llamaAPI = new LlamaApi("LL-nKsgccRWk2dILvQgrhl1LZPNo955pfk6iGJQSOTACfyKIs2SgKCXT1U5mxqX9Y5v")


//  llamaAPI.run({
//     'model':"llama2-13b-chat",
//     "messages": [
//         { "role": "user", 
//         "content": `Generate novel 3 high school algebra question in a multiple-choice format with four answer options. Structure the question and answers as json where the answers are in an array and the question is an attribute in json and the correct answer is an attribute. Only return the JSON, no pleasantries.`}
//         ],
//     "function_call": "generate_math_question_json"
//     }).then(res=>console.log(JSON.stringify(res.choices[0].message))).catch(err=>console.log(err))
export default llamaAPI