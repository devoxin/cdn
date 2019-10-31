const { isUserAuthorized } = require('../utils/checks.js');

module.exports = {
  method: 'get',
  path: '/dashboard',
  middleware: [],
  handler: ({ user }, res) => {
    if (!user) {
      return res.redirect('auth/login');
    }

    if (!isUserAuthorized(user.id)) {
      // res.render('error', { message: 'You do not have access to this service.' })
      return res.status(401).send('You do not have access to this service.');
    }

    // res.render('dashboard');
  }
};
