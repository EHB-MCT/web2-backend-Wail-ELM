const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); 
const authRoutes = require('./routes/routes');
app.use('/routes', authRoutes);
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port 3000`);
});

[]
