const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const {
  MongoClient
} = require('mongodb');
const router = express.Router();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
router.use(cors());
router.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MongoDB');
});

app.post('/register', async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;

  


  try {
    
    const existingUsername = await client.db('August-web2').collection('users').findOne({
      username
    });
    if (existingUsername) {
      return res.status(400).json({
        message: 'Ce nom d\'utilisateur est déjà utilisé'
      });
    }

    
    const existingEmail = await client.db('August-web2').collection('users').findOne({
      email
    });
    if (existingEmail) {
      return res.status(400).json({
        message: 'Cette adresse e-mail est déjà utilisée'
      });
    }

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Veuillez remplir tous les champs requis'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.db('August-web2').collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      message: 'Inscription réussie'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de l\'inscription'
    });
  }
});

app.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const existingUser = await client.db('August-web2').collection('users').findOne({
      email
    });
    if (!existingUser) {
      return res.status(400).json({
        message: 'Adresse e-mail ou mot de passe incorrect'
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Adresse e-mail ou mot de passe incorrect'
      });
    }

    res.status(200).json({
      message: 'Connexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de la connexion'
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = router;