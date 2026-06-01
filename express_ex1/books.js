import express from 'express'

const app = express()


const authentificat = (req,res,next)=>{
    const {username,password} = req.body
    if(username=='admin',password=='admin') return next();
}

app.use(authentificat)
app.get

app.listen(8000,()=>{
    console.log('welcome')
})