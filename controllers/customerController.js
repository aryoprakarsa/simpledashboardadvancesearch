const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


var Customer = require('../models/customer');


var async = require('async');


exports.index = function(req, res) {
    Customer.find({})
    .sort({'_id': -1})
    .exec(function (err, list_customers) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(list_customers)
      res.render('index', { title: 'List Customers', navBrand: 'List Customers', customer_list: list_customers });
    });

};

// Search customer
exports.search = function(req, res) {
    let query = req.query.q;
    
    console.log(query);

    let findObj = {};
    if(query) {
        findObj = {
            $or:[
                { first_name: { $regex:  new RegExp("^"+ query  +".*", "i") } },
                { last_name: { $regex: new RegExp("^"+ query +".*", "i") } },
                { gender: { $regex: new RegExp("^"+ query +".*", "i") } },
                { marital_status: { $regex: new RegExp("^"+ query +".*", "i") } },
                { address: { $regex: new RegExp(".*"+ query +".*", "i") } },
                { 'contact.phone': { $regex: new RegExp(".*"+ query +".*", "i") } },
                { 'contact.email': { $regex: new RegExp(".*"+ query +".*", "i") } }
            ],
        }
    }

    Customer.find(findObj)
    .exec(function (err, list_customers) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(list_customers);

      res.render('customers_rows', { customer_list: list_customers });
    });
    
};


exports.searchMultipleCriteria = function(req, res) {
    Customer.apiQuery(req.query)
    .sort({'_id': -1})
    .exec(function (err, list_customers) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(list_customers)
      res.render('customers_rows', { customer_list: list_customers });
    });
    
};

// Display list of all Customers.
exports.customer_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer list');
};

// Display detail page for a specific Customer.
exports.customer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer detail: ' + req.params.id);
};

// Display Customer create form on GET.
exports.customer_create_get = function(req, res) {
    res.render('create_customer', { title: 'Create Customer', navBrand: '<i class="fa fa-arrow-circle-o-left"></i> Create Customer' });
};

// Handle Customer create on POST.
exports.customer_create_post = function(req, res, next) {
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('marital_status').exists().trim('status is required')
    body('contact.email').isEmail().withMessage('must be an email').trim().normalizeEmail()
    body('contact.phone').exists().withMessage('phone number is required').trim()
    body('address').exists().trim()

    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate()


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('create_customer', { title: 'Create Customer', navBrand: '<i class="fa fa-arrow-circle-o-left"></i> Create Customer' });
        return;
    } else {
        // Data from form is valid.

        // Create an Author object with escaped and trimmed data.
        const contact = {
            email: req.body['contact.email'],
            phone: req.body['contact.phone']
        }
        let customer = new Customer(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                gender: req.body.gender,
                status: req.body.status,
                contact: contact,
                address: req.body.address
            });
        customer.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.redirect('/');
        });
    }
};

// Display Customer delete form on GET.
exports.customer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer delete GET');
};

// Handle Customer delete on POST.
exports.customer_delete_post = function(req, res) {
    console.log(req.params);
    Customer.findByIdAndRemove(req.params.id, function deleteCustomer(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.send('success');
    })
   
};

// Display Customer update form on GET.
exports.customer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer update GET');
};

// Handle Customer update on POST.
exports.customer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer update POST');
};