const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./configs/db')
const bodyParser = require('body-parser')
const Configs = require('./configs')
const apiRoutes = require('./routes');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use(Configs.getServerConfigs().prefix, apiRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const main = async () => {
  try {
    await connectDB()
    app.listen(process.env.PORT || port, () => {
      console.log("Server running at http://localhost:" + port);
    })
  } catch (err) {
    console.log(err, 'Fail to connect to DB');
  }
}

main()
