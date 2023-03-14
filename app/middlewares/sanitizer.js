const sanitize = require('sanitize-html');
// cf : https://www.npmjs.com/package/sanitize-html

function sanitizeObject (obj){

  // on nettoie chaque propriété de l'objet d'entrée
  for (prop in obj) {
    obj[prop] = sanitize(obj[prop], {allowedTags: []});
  }

  /* 
  
  par exemple :
  
  const input = {
    title: '<h1>Test</h1>',
    subtitle: '<strong>Test</strong>',
  };

  deviendrait :

  const output = {
    title: 'Test',
    subtitle: 'Test',
  }; */

}

function sanitizeMW(req, res, next){
  // on nettoie toutes les entrées de la query string ex : ?var1=<h1>val1</h1>
  sanitizeObject(req.query);
  // on nettoie toutes les entrées de la query string ex : /search/<h1>val1</h1> pour une route param de type /search/:text
  sanitizeObject(req.params);

  if (req.body){
    // on nettoie toutes les données qui arrivent dans le corps de la requête (depuis un form en POST par ex)
    sanitizeObject(req.body);
  }

  next();
}

module.exports = sanitizeMW;