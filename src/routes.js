const pages = [
  {
    output: './index.html',
    content: {
      title: 'Home',
      description: 'Home Page'
    },
    template: './src/views/pages/home.hbs'
  },
  {
    output: './about/index.html',
    content: {
      title: 'About',
      description: 'About Page'
    },
    template: './src/views/pages/about.hbs'
  }
];

module.exports = pages;
