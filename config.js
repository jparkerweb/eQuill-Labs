module.exports = {
  input: 'src/templates',
  output: 'pages',
  partials: 'src/templates/partials',
  layouts: 'src/templates/layouts',
  helpers: {
    eq: function(a, b) {
      return a === b;
    }
  },
  staticFiles: {
    source: 'src/static',
    target: 'pages'
  }
};
