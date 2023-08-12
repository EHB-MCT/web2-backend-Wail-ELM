
const cors = require('cors');
const express = require('express');
app.use(cors()); 
const app = express();
const authRoutes = require('./routes/routes');
app.use('/routes', authRoutes);
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port 3000`);
});

[]
