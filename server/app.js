const {Configuration,OpenAIApi} = require("openai");
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json())

const configuration = new Configuration({
    apiKey:process.env.api_key
})
const openai = new OpenAIApi(configuration)

app.post("/",async(req,res)=>{
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
            stop:["\"\"\""]
        })
        res.status(200).send({
            bot:response.data.choices[0].text
        })
    }catch(er){
        console.log(er)
        res.status(500).send(er)
    }
})






app.listen(5000,()=>console.log("app listening.."))