import utilsModule from './utils.js';

// ici, on a un peu l'équivalent d'un datamapper mais côté front
// c'est notre couche d'accès aux données
const apiModule = {

  // fonction récupérant les listes en s'appuyant depuis l'api
  // renvoie les listes ou une exception en cas de problème
  async getAllLists(){
    try{
      // appel de l'api, récupération de la réponse HTTP
      const response = await fetch(`${utilsModule.baseUrl}/lists`);

      console.log(response);

      // Si on a un code autre qu'un 2XX,
      // on lance un erreur (le coce continuera dans le catch)
      if (!response.ok){
        body = await response.json();
        throw new Error(body.error);
      }

      // on "décode" le json reçu en objet (un tableau d'objet ici représentant les listes)
      const lists = await response.json();

      // on renvoie les listes
      return lists;
    
    }catch(error){ // en cas de problème
      // on loggue l'erreur
      // plutôt pendant le dev
      console.error(error);     
      
      // on re-lance l'erreur levée
      throw error;
    }
  },

  async createList(newListData){
    try{
      // on envoie une requête POST vers le point de terminaison /lists
      // en transmettant dans le corps de la requête les informations
      // concernant la liste à créer (ici, seulement son nom)
      const response = await fetch(`${utilsModule.baseUrl}/lists`, {
        method: 'POST',
        body: newListData,
      });

      // si l'API me renvoie autre chose qu'une réponse 2XX
      // on lance une erreur
      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

      // sinon (le code continue bien si on n'est pas rentré dans le if
      // on retourne les information concernant la liste créée
      // avec notamment son id
      const createdList = await response.json();
      console.log(createdList);
      return createdList;

    }catch(error){ // en cas d'erreur
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }
  },

  async updateList(listData){
    try{

      const listId = listData.get('id');

      const response = await fetch(`${utilsModule.baseUrl}/lists/${listId}`, {
        method: 'PATCH',
        body: listData,
      });

      // si l'API me renvoie autre chose qu'une réponse 2XX
      // on lance une erreur
      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

      const updatedList = await response.json();
      
      return updatedList;

    }catch(error){ // en cas d'erreur
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }
  },

  // on trow une erreur si un pb arrive,
  // on ne retourne rien sinon
  async deleteList(listId){
    
    try{
      const response = await fetch(`${utilsModule.baseUrl}/${listId}`, { method: 'DELETE'});

      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

    }catch(error){
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }
  },

  async createCard(newCardData){
    try{
      const response = await fetch(`${utilsModule.baseUrl}/cards`, {
        method: 'POST',
        body: newCardData,
      });

      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

      const createdCard = await response.json();

      return createdCard;

    }catch(error){ // en cas d'erreur
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }

  },

  async updateCard(cardData){
    try{

      const cardId = cardData.get('id');

      const response = await fetch(`${utilsModule.baseUrl}/cards/${cardId}`, {
        method: 'PATCH',
        body: cardData,
      });

      // si l'API me renvoie autre chose qu'une réponse 2XX
      // on lance une erreur
      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

      const updatedCard = await response.json();
      
      return updatedCard;

    }catch(error){ // en cas d'erreur
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }
  },

  async getAllTags(){
    try{

      const response = await fetch(`${utilsModule.baseUrl}/tags`);

      if (!response.ok){
        const body = await response.json();
        throw new Error(body.error);
      }

      const tags = await response.json();

      return tags;

    }catch(error){ // en cas d'erreur
      console.error(error);// on loggue
      throw error;// on réemet l'erreur
    }
  },
  
};

export default apiModule;