module.exports = {
  method: 'get',
  path: '/',
  middleware: [],
  handler: (req, res) => {
    const text = req.user.username || 'Login';
    const url = !req.user.username ? '/auth/login' : '/auth/logout';
    res.render('index', { text, url });
  }
}
