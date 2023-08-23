const express = require('express');
const app = express(); // Add parentheses to call the express function
const mongoose = require('mongoose');
const router = express.Router()
const severless = require('serverless-http')
require('dotenv').config(); // Chargez les variables d'environnement du fichier .env
const authController = require('./src/controllers/authController')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {checkUser } = require('./src/controllers/authController')
router.use(cors())
router.use(express.json());
router.use(cookieParser());
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.post('/MesSmartphones/:id', authController.commands_post)
router.get('/users', authController.users_get); // get all users
router.get('/user', authController.user_get); // get spécifique user
router.use('/.netlify/express' , router)
module.exports.handler = severless(app)
/*
app.get('/logout', authController.requireAuth, (req, res) => {
  res.render('logout');
});
*/
// Route '/logout' - GET route for user logout
/*
app.get('/logout', authController , (req,res)=> {
  res.render('logout');
});
*/
// Middleware
app.get('*', checkUser);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
const dburi = process.env.DBURI;
mongoose.set('strictQuery' , false)
const connectdb = async () => {
try {
  const conn = await mongoose.connect(dburi ,{ useNewUrlParser: true, useUnifiedTopology: true })
  console.log(`mongodb connected:${conn.connection.host}`)
} catch(error) {
  console.error('erreur userauth', error)
  process.exit(1)
}
}
const PORT = process.env.PORT 
connectdb().then(()=> {
  app.listen(PORT, ()=> {
  console.log(`serveur started at ${PORT}`) 
})
})



