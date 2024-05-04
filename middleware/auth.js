import LocalStrategy from "passport-local";
import  prisma from "../db/index.js"
import Bearer from 'passport-http-bearer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
function setUpPassportLocal(passport){
passport.use(new Bearer.Strategy(async (token, done) => {
  try {
    // Verify token authenticity and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user data from Prisma
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return done(null, false); // Invalid token or user not found
    }

    // Pass authenticated user object to next middleware
    done(null, user);
  } catch (error) {
    done(error); // Handle errors gracefully
  }
}))
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session (important for CSRF protection)
});

passport.deserializeUser((id, done) => {
  prisma.user.findUnique({ where: { id } }) // Fetch user data from DB
    .then(user => done(null, user))
    .catch(error => done(error));
});

}

function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.redirect("/login");
    }
  }

export {checkIfAuthenticated,setUpPassportLocal}