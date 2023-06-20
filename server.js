const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.listen(3000, () => {
  console.log(`Serveur démarré sur le port 3000`);
});

[]
