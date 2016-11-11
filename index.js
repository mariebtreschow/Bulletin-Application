const morgan = require('morgan'),
      pug = require('pug'),
      express = require('express'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize');


var app = express(),
    sequelize = new Sequelize('marietreschow', 'marietreschow', '', { dialect: 'postgres' });

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';


app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.set('view engine', 'pug');

//======== creating table in database =========

var Message = sequelize.define('message', {
   title: Sequelize.STRING,
   body: Sequelize.STRING
});

//=========== server ==================

app.get('/', (req, res) => {
   res.redirect('/views');
});

app.get('/views', (req, res) => {
   res.redirect('/messages');
});

app.get('/messages', (req, res) => {
   console.log('Requesting messages');
   res.render('messages/index');
});

app.get('/messages/show', (req, res) => {
   Message.findAll({ order: 'id ASC'}).then((message) => {
      res.render('messages/show' , { messages: message });
   });
});

app.post('/messages', (req, res) => {
   if (req.body.title) {
      Message.create(req.body).then(() => {
         res.redirect('messages/show');
      });
   } else {
      res.redirect('messages');
   }
});

sequelize.sync().then(() => {
 app.listen(3000, () => {
   console.log('App is listening to port 3000...');
   });
});
