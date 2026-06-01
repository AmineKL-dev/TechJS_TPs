import express from 'express'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const app = express();


const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/booksDB');

        console.log('Connected to MongoDB');
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
    }
}

const userShema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  }
})
const User = mongoose.model('User',userShema)

const auth = async (req, res, next) => {
  const username = req.headers['username'];
  const password = req.headers['password'];
  // Get user from database
  const user = await User.findOne({username})
  if(!user) return res.status(401).json({message:'User not found'})
    // compare password
  const isMatch = bcrypt.compareSync(password,user.password)
  if(!isMatch) return res.status(401).json({message:'Invalid password'})
  next();
};


app.use(express.json());
app.get('/login',auth,(req,res)=>{
    res.json({message:'Welcome to the books API'})
    }
    )

const books = [
  { id: 1, title: 'JavaScript' },
  { id: 2, title: 'Node.js' }
];

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue! Utilisez headers username et password pour accéder aux livres' });
});
// Enregistrer un niuvle utilisateur dans model user
app.post('/register',async(req,res)=>{
  console.log(req.body[0].username)
    const username = req.body[0].username;
    const password = req.body[0].password;
    if(username && password){
      // Hash password before saving
      const hashedPasssword = bcrypt.hashSync(password,10)
      console.log(hashedPasssword)
      await User.create({username:username,password:hashedPasssword})
      res.json({message:'User registered successfully'})
    }else{
      res.status(400).json({message:'Username and password are required'})
    }
    
})
app.get('/books', (req, res) => {
  res.json(books);
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
