#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Customer = require('./models/customer')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var customers = []

function customerCreate(first_name, last_name, d_birth, gender, marital_status, address, contact, cb) {
  customerdetail = {
      first_name:first_name, 
      last_name: last_name,
      date_of_birth: d_birth,
      gender: gender,
      marital_status: marital_status,
      address: address,
      contact: contact
  }
  
  var customer = new Customer(customerdetail);
       
  customer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Customer: ' + customer);
    customers.push(customer)
    cb(null, customer)
  }  );
}

function createCustomers(cb) {
    async.parallel([
        function(callback) {
            contact = {
                'email': 'patrick.rothfuss@telpod.io',
                'phone': '+1 (987) 451-2562'
            }
            customerCreate('Patrick', 'Rothfuss', '1965-06-06', 'male', 'single', "594 Benson Avenue, Gila, Rhode Island, 8518", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'fowler.rothfuss@telpod.io',
                'phone': '+1 (828) 479-2698'
            }
            customerCreate('Rot', 'Fowler', '1985-07-01', 'male', 'single', "281 Fayette Street, Grandview, New York, 6203", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'haley@telpod.io',
                'phone': '+1 (818) 239-2298'
            }
            customerCreate('Odessa', 'Haley', '1976-01-20', 'male', 'married', "236 Garden Street, Bangor, Texas, 117", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'ramos@telpod.io',
                'phone': '+1 (821) 421-2198'
            }
            customerCreate('Charmaine', 'Ramos', '1988-03-12', 'female', 'single', "616 Gatling Place, Rote, Nebraska, 7459", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'cole.ware@telpod.io',
                'phone': '+1 (820) 479-2128'
            }
            customerCreate('Ware', 'Cole', '1985-11-11', 'female', 'married', "466 Broadway , Bourg, Colorado, 7434", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'leon@telpod.io',
                'phone': '+1 (811) 472-5628'
            }
            customerCreate('Leon', 'Rowe', '1982-08-28', 'male', 'married', "449 Sands Street, Northchase, North Dakota, 7692", contact, callback);
        },
        function(callback) {
            contact = {
                'email': 'gallagher@telpod.io',
                'phone': '+1 (328) 479-2998'
            }
            customerCreate('Gallagher', 'Talley', '1975-12-01', 'female', 'divorced', "959 Pershing Loop, Noblestown, Tennessee, 8233", callback);
        },
        function(callback) {
            contact = {
                'email': 'morin@telpod.io',
                'phone': '+1 (818) 239-2698'
            }
            customerCreate('Julie', 'Morin', '1984-10-04', 'male', 'single', "466 McKinley Avenue, Rodman, Connecticut, 5575", callback);
        },
        function(callback) {
            contact = {
                'email': 'heath@telpod.io',
                'phone': '+1 (821) 478-2698'
            }
            customerCreate('Heath', 'Hatfield', '1986-02-25', 'male', 'married', "506 Williams Place, Silkworth, Wyoming, 9793", callback);
        },
    ], cb);
}

async.series([
    createCustomers,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('results: '+ results);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



