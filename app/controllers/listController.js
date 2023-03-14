const { List } = require ('../models');

// équivalent à :
// const models = require ('./models');
// const List = models.List;

const listController = {
  async getAll(req, res){
    
    try{
      
      // on s'appuie sur la couche modèle pour récupérer l'ensemble des listes    
      const lists = await List.findAll({
        include: {
          association: 'cards',
          include: 'tags',
        },
        order: [        
          ['position', 'ASC'],
          ['cards', 'position', 'ASC'],
          ['cards', 'tags', 'name', 'ASC'],
        ],
      });    
      // on retourne les liste au format json
      return res.json(lists);      
    }catch(error){ // en cas de problème
      console.log(error);
      console.trace();
      // on renvoie un code erreur 500 et un message expliquant le problème
      return res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }    
  },

  async getOne(req, res){

    try{
      // on récupère peuis le paramètre de route l'identifiant de la liste à récupérer
      const listId = Number(req.params.id);

      // on demande à la couche modèle la liste en question
      const foundList = await List.findByPk(listId,{
        include: {
          association: 'cards',
          include: 'tags',
        },
        order: [                  
          ['cards', 'position', 'ASC'],
          ['cards', 'tags', 'name', 'ASC'],
        ],
      });

      if (!foundList){
        return res.status(404).json({ error: "List not found. Please verify the provided id." });
      }

      // on renvoie la liste trouvée
      return res.json(foundList);

    }catch(error){ // en cas de problème
      console.log(error);
      console.trace();
      // on renvoie un code erreur 500 et un message expliquant le problème
      return res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }

  },

  async remove(req, res){
    try{
      const listId = Number(req.params.id);

      // on récupère la liste à supprimer
      /*
      const foundList = await List.findByPk(listId);

      if (!foundList){
        return res.status('404').json({ error: "List not found. Please verify the provided id." });
      }

      await foundList.destroy();
      */

      const nbSuppressedList = await List.destroy({
        where: {
          id: listId,
        },
      });

      if (nbSuppressedList === 0){
        return res.status('404').json({ error: "List not found. Please verify the provided id." });
      }

      return res.sendStatus(204);

    }catch (error){
      console.log(error);
      console.trace();
      // on renvoie un code erreur 500 et un message expliquant le problème
      return res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }
  },

  async create(req, res){

    console.log(req.body);
    
    try{
      // on peut accéder à req.body car on a brancher le middleware express.urlencoded sur notre app dans le point d'entrée
    
      // avant d'insérer, on vérifie que les données reçues sont conforme
      if (!req.body.name){
        return res.status(400).json({ error: "Missing body parameter: name" });
      }

      if ((req.body.position !== undefined && isNaN(req.body.position)) || req.body.position === ""){
        return res.status(400).json({ error: "Invalid type: position should be a number" });
      }

      // on récupère les informations concernant la liste à créer dans le body
      const listData = {
        // garder seulement les tags img : name: sanitizeHtml(req.body.name, { allowedTags: ['img']}),
        name: req.body.name,
        // position: isNaN(Number(req.body.position)) ? 0 : Number(req.body.position),
      };

      // on indique la position seulement si elle est définie
      if (req.body.position){
        listData.position = Number(req.body.position);
      }

      // on crée la liste en s'appuyant sur la couche modèle
      const list = await List.create(listData);
      // équivalent à :
      // const list = List.build(listData);
      // await list.save();

      // on retourne les information de la liste créée (notamment pour retourner l'id de la liste créée)
      res.json(list);
    }catch (error){
      console.log(error);
      console.trace();
      // on renvoie un code erreur 500 et un message expliquant le problème
      return res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }   

  },

  async update (req, res){
    try{
      // récupérer l'id de la liste à modifier
      const listId = Number(req.params.id);

      // vérifier que cette liste existe
      const foundList = await List.findByPk(listId);

      // gestion des erreurs
      if (!foundList){
        return res.status(404).json({ error: "List not found. Please verify the provided id." });
      }

      if (typeof(req.body.name) !== "undefined" && typeof(req.body.name) !== "string"){
        return res.status(400).json({ error: "Invalid body parameter 'name'. Should provide a string." });
      }

      if ((req.body.position !== undefined && isNaN(req.body.position)) || req.body.position === ""){
        return res.status(400).json({ error: "Invalid body parameter 'position'. Should provide a number." });
      }

      // la deusième partie du test && req.body.position !== 0
      // permet la mise à jour de la liste si on a seulement la valeur 0 pour position
      // nécessaire car 0 est falsy
      if ((!req.body.name && !req.body.position) && req.body.position !== 0){
        return res.status(400).json({ "error": "Invalid body. Should provide at least a 'name' or 'position' property" });
      }

      // préparation des données à mettre à jour avec les données reçues
      const listNewData = {        
      };

      if (req.body.name){
        listNewData.name = req.body.name;
      } 

      if (req.body.position){
        listNewData.position = Number(req.body.position);
      }

      // mise à jour effective des données en s'appuyant sur la couche modèle
      await foundList.update(listNewData);

      // renvoyer les informations de la liste modifiée        
      return res.json(foundList);
    }catch (error){
      console.log(error);
      console.trace();
      // on renvoie un code erreur 500 et un message expliquant le problème
      return res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }

  },
};

module.exports = listController;