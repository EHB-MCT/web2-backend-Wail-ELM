const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  // Ajoute les champs spécifiques à l'utilisateur
});

const User = model('User', userSchema);

module.exports = User;
