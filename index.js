require("dotenv").config()
const express = require('express');
const axios = require('axios');
const cors=require("cors")
const app=express()
const port=process.env.port


app.use(express.json())
app.use(cors())

const apiKey =process.env.API_KEY
const openaiEndpoint=process.env.OPENAI_URL

console.log(apiKey,openaiEndpoint)

// Function to interact with ChatOpenAI


const generate = async (prompt) => {
  try {
    const response = await axios.post(openaiEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

   return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return error.message
  }
};


// api request
  app.post("/generate-content", async(req,res)=>{
    const {type,subject}=req.body

    const prompt=`can you create  ${type} from  ${subject}`

    try {
        
        const content= await generate(prompt);

        res.send({content:content})

    } catch (error) {
        res.status(500).json({ error: 'Error processing the question' });
    }

  })
// connect to server
  app.listen(port,()=>{
    console.log(`server is running on ${port}`)
  })
