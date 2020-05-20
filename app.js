const express = require('express');
const multer = require('multer');
const expbs = require('express-handlebars');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sass = require('node-sass-middleware');

const multipart = multer();

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const app = express();
const port = 8080;

const devServerEnabled = true;

if (devServerEnabled) {
    //reload=true:Enable auto reloading when changing JS files or content
    //timeout=1000:Time from disconnecting from server to reconnecting
    config.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
}

const hbs = expbs.create({
    extname: '.hbs',
    defaultLayout: 'base',
    layoutsDir: path.join(__dirname, 'src/views/layouts'), // change layout folder name
    partialsDir: path.join(__dirname, 'src/views/partials'), // change partials folder name

    // create custom express handlebars helpers
    helpers: {
        calculation: function(value) {
            return value * 5;
        },

        list: function(value, options) {
            let out = "<ul>";
            for (let i = 0; i < value.length; i++) {
                out = out + "<li>" +  options.fn(value[i]) + "</li>";
            }
            return out + "</ul>";
        }
    }
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Express Handlebars Configuration
app.engine('.hbs',  hbs.engine);
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', '.hbs');

// view engine setup
app.use(sass({
  /* Options */
  src: path.join(__dirname, '/src/styles'),
  dest: path.join(__dirname, '/public/css'),
  debug: true,
  outputStyle: 'compressed',
  prefix:  '/public/css',  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
  includePaths: [path.join(__dirname), 'node_modules'],
}));

// Sending static files with Express 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter);
app.use('/users', usersRouter);


//API
app.post('/api/add', multipart.any(), function (req, res) {

    //execute addition(tasizan)
    const firstValue = parseInt(req.body.firstValue);
    const secondValue = parseInt(req.body.secondValue);
    const sum = firstValue + secondValue;

    //return result
    res.json({sum: sum, firstValue: firstValue, secondValue: secondValue});

});

app.listen(port, () => {
    console.log('Server started on port:' + port);
});