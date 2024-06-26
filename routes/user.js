import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from "../db/index.js";

// module.exports = function (passport){
const router = express.Router()

export default function(authMiddleware){
router.get("/",async (req, res)=>{
  const token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
     res.status(401).json({   name: 'TokenExpiredError',
     message: 'jwt expired'})
    }else{
      res.status(200).json({   
        name: 'TokenSuccess',
        message: 'Token Acitive'})
    }
  })
})
router.get("/auth",async (req, res)=>{
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
       res.status(401).json({   name: 'TokenExpiredError',
       message: 'jwt expired'})
      }else{
        res.status(200).json({   
          name: 'TokenSuccess',
          message: 'Token Acitive'})
      }
    })
  })
router.get("/user",authMiddleware,async (req, res) => {
  res.json({user:req.user})
})
router.get("/topic/:id/",authMiddleware,async (req, res) => {
  
    const differenceInMilliseconds = Date.now() - (1000 * 60 * 60);
    let users = await prisma.user.findMany({where: {
        activity: {
          some: {
            lastActive: {
              gte: new Date(differenceInMilliseconds), },
          },
        },
       topics: {
          some: {id:req.params.id},
        },
      },})
      res.json(users)
})

router.post('/register', async (req, res) => {
    const { email, password,name,educator } = req.body;
  
    try {
      // Validate input and ensure uniqueness
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'email already exists' });
      }
  
      // Hash password securely (at least 10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email,name:name, password: hashedPassword,educator:educator, lastActive: new Date()},
      });
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '23h' });
  
      res.status(201).json({ message: 'User registered successfully', token }); // Securely send token in header
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: 'Registration failed' });
    }
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by username
      const user = await prisma.user.findUnique({ where: { email } });
        
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token with user ID
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '23h' }); // Adjust expiration as needed
      await prisma.user.update({where:{email: email},data: {
       lastActive: new Date()
      },})
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });

router.post("/logout", async function (req, res, next) {

})
// function extractToken (req) {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         return req.headers.authorization.split(' ')[1];
//     } else if (req.query && req.query.token) {
//         return req.query.token;
//     }
//     return null;
// }
return router
}