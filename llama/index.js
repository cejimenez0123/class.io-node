import LlamaApi from "llamaai"
 const llamaAPI = new LlamaApi(process.env.LLAMA_API)
// const llamaAPI = new LlamaApi("LL-nKsgccRWk2dILvQgrhl1LZPNo955pfk6iGJQSOTACfyKIs2SgKCXT1U5mxqX9Y5v")


//  llamaAPI.run({"model": "llama2-13b-chat",
//  "messages": [
//    {
//      "role": "user",
//      "content": "Generate  3 quiz words from highschool algebra and its definition in a json format with attributes front with the word and back with the definition. No pleasantries"
//    }
//  ],
//  "function_call": "create_math_flashcards"
//  }).then(res=>console.log(JSON.stringify(res.choices[0].message))).catch(err=>console.log(err))
export default llamaAPI