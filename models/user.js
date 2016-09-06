/*
 * Represents a player in the game
 * @param name [String]: old state to intialize the new state
 */
var config = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

/*
 * User Schema
 */
var UserSchema = new Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
