require ('dotenv').config();
const cors = require('cors');

const express = require('express');
const multer = require('multer');

const sanitizeMW = require ('./app/middlewares/sanitizer');
const router = require ('./app/router');

const app = express();
const PORT = process.env.PORT_BACK || 5000;

/**************/
/*  Swagger   */
/**************/

const expressSwagger = require('express-swagger-generator')(app);

expressSwagger({
  swaggerDefinition: {
      info: {
          description: 'Gestion de mon emploi du temps',
          title: 'Okanban Swagger',
          version: '1.0.0',
      },
      host: 'localhost:3000',
      basePath: '/api',
      produces: [
          "application/json"
      ],
      schemes: ['http'],
      securityDefinitions: {
      }
  },
  basedir: __dirname, //app absolute path
  files: ['./app/router.js'] //Path to the API handle folder
});


// CORS
// - si on ne branche pas le mw cors, les requêtes cross-origin ne sont pas pas autorisées,
// - si on le branche sans option, les requêtes cross-origin depuis TOUTES les origines sont autorisées,
// -> app.use(cors());
// - si on branche avec une valeur pour origin dans les options, seule celle-ci est autorisé.
// -> app.use(cors({  origin: 'http://localhost:5000' }));
// - si on branche avec plusieurs valeurs pour origin dans les options, seules celle-ci sont autorisées.
// -> app.use(cors({  origin: [ null, 'http://localhost:5000'] }));

// dans notre cas, pas besoin d'autorisé des requêtes cross origin
// front et back sont sur le même domaine.
// app.use(cors());

app.use(express.static('dist'));

// on ajoute le middleware qui permet d'alimenter req.body avec le corps de la reqûete reçue
app.use(express.urlencoded({ extended: true }));

// on branche le middleware multer sur notre application
// (extraction des données au format muiltipart/form-data vers req.body)
const bodyParser = multer();
// on utlise .none() pour dire qu'on attends pas de fichier, uniquement des inputs "classiques" !
app.use( bodyParser.none() );


app.use(sanitizeMW);

app.use(router);

app.listen(PORT, () => {
  console.log(`Okanban is listening on port ${PORT}`)
})

