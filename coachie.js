var config = require('./config');
var Maki = require('maki');

var chaz = new Maki( config );

var Passport = require('maki-passport-local');
var passport = new Passport({
  resource: 'User'
});

chaz.use( passport );

chaz.define('User', {
  attributes: {
    username: { type: String , slug: true, max: 32 },
    password: { type: String , masked: true },
    email: { type: String, max: 64 },
    _games: { type: [chaz.mongoose.SchemaTypes.ObjectId]},
    coach: { type: Boolean, default: false },
    bio: { type: String, max: 240 }
  },
  icon: 'user'
});

chaz.define('Review', {
  attributes: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, max: 240 },
    _player: {
      type: chaz.mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      populate: [{
        method: 'get',
        fields: 'username'
      }]
    }, 
    _coach: {
      type: chaz.mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      populate: [{
        method: 'get',
        fields: 'username'
      }]
    }
  },
  icon: 'comments'
});

var Game = chaz.define('Game', {
  attributes: {
    shortname: { type: String, index: true },
    name: { type: String },
    image: { type: String } //image URL
  },
  icon: 'game'
});

var Slot = chaz.define('Slot', {
  attributes: {
    title: { type: String , max: 100 },
    startTime: { type: Date , required: true },
    endTime: { type: Date , required: true },
    rate: { type: Number },
    _creator: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User' },
    _booking: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'Booking' }
  },
  icon: 'calendar'
});

Slot.pre('create', function(next, done) {
  var slot = this;
  if (!slot.endTime) {
    //By default set endTime to 1 hour after start
    slot.endTime = slot.startTime + 3600 * 1000;
  }
  return next( null , slot );
});

var Booking = chaz.define('Booking', {
  attributes: {
    _slot: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'Slot' },
    _user: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User' },
    price: { type: Number },
    status: { type: String, enum: ['unpaid','cancelled', 'paid', 'refunded', 'complete']}
  },
  icon: 'book'
});

chaz.start();
