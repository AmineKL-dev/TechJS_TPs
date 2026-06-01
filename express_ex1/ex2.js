// import 
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const app = express()
app.use(express.json());
// Connection to MongoDB
const connectDB = async ()=>{
    try{
        await  mongoose.connect("mongodb://127.0.0.1:27017/ex2");
        console.log('connected to db')
    }catch(err){
        console.log('err :',err)
    }
}

const Usershema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

connectDB()
const User = mongoose.model('User',Usershema)
//Middl

const auth = async (req, res, next) => {
  try {
    const username = req.headers.username;
    const password = req.headers.password;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// routes

app.get('/',(req,res)=>{
    res.json({
        message:'bienvenue !'
    })
})

app.post('/register', async (req, res) => {
  try {
    console.log(req.body)
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      username,
      password: hashedPassword
    });

    res.json({
      message: 'User registered successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error registering user'
    });
  }
});

// login

app.get('/login',auth,(req,res)=>{
    res.json({
    message: 'Login successful'
  });
})

const books = [
  { id: 1, title: 'JavaScript' },
  { id: 2, title: 'Node.js' }
];

app.get('/books', auth, (req, res) => {
  res.json(books);
});

//server
app.listen(8000, () => {
  console.log('Server running on port 8000');
});