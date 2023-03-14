var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const contactController = require('../controllers/contact');
const collection = require('../config/collection')
var db = require('../config/connect')

const isAuthenticatedUser = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}

router.get('/', isAuthenticatedUser, (req, res) => {
    let user = req.session.user;
    res.render('user/dashboard', { user });
});

router.get('/dashboard', isAuthenticatedUser, (req, res) => {
    let user = req.session.user;
    res.render('user/dashboard', { user });
});

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.get('/register', (req, res) => {
    res.render('user/signup');
});

router.get('/change-credentials/:id', isAuthenticatedUser, (req, res) => {
    let user = req.session.user;
    res.render('user/change-credentials', { user });
});

router.get('/add-contact', isAuthenticatedUser, (req, res) => {
    res.render('contact/add-contact');
});

router.get('/view-contact', isAuthenticatedUser, (req, res) => {
    contactController.viewContact().then((contacts) => {
        res.render('contact/view-contact', { contacts })
    })
});

router.get('/update-contact/:id', isAuthenticatedUser, (req, res) => {
    contactController.getContact(req.params.id).then((contact) => {
        res.render('contact/update-contact', { contact });
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
});

router.get('/delete-contact/:id', (req, res) => {
    let conId = req.params.id;
    contactController.deleteContact(conId).then((response) => {
        res.redirect('/user/view-contact');
    })
})

router.post('/register', (req, res) => {
    userController.register(req.body).then((response) => {
        console.log(response);
        req.session.loggedIn = true
        req.session.user = response;
        res.redirect('/')
    })
});

router.post('/add-contact', isAuthenticatedUser, (req, res) => {
    contactController.addContact(req.body).then((response) => {
        console.log(response);
        res.redirect('/user/dashboard')
    })
});

router.post('/login', (req, res) => {
    userController.login(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            req.session.user = response.user
            res.redirect('/user/dashboard');
        } else {
            req.session.userLogginErrr = response.Errmsg;
            errors = req.session.userLogginErrr
            res.render('user/login', { errors })
        }
    })
});

router.post('/update-contact/:id', isAuthenticatedUser, (req, res) => {
    contactController.updateContact(req.params.id, req.body).then(() => {
        res.redirect('/user/dashboard');
    })
});

router.post('/change-credentials/:id', isAuthenticatedUser, (req, res) => {
    userController.updateCredentials(req.params.id, req.body).then(() => {
        res.redirect('/user/dashboard');
    })
})

module.exports = router;
