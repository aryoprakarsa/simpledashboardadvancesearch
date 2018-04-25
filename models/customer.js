var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100, index: true},
    last_name: {type: String, max: 100, index: true},
    date_of_birth: {type: Date, required: true},
    gender: {type: String, required: true, enum: ['male', 'female'], default: 'male', index: true},
    marital_status: {type: String, required: true, enum: ['single', 'married', 'divorced'], default: 'single', index: true},
    address: {type: String},
    contact: Schema.Types.Mixed
  }
);

CustomerSchema
.virtual('name')
.get(function () {
    return this.first_name + ' ' + this.last_name ;
});

mongoose.plugin(require('mongoose-string-query'));

//Export model
module.exports = mongoose.model('Customer', CustomerSchema);