import cardModule from "./card.js";
import utilsModule from "./utils.js";

const tagModule = {
  makeTagInDOM(tagToCreate){
    
    console.log(tagToCreate);

    // on accède au template de tag
    const templateTag = document.querySelector('#tagTemplate');
    // on clone le template de tag et on récupère un fragment de document
    const clone = document.importNode(templateTag.content, true);
    // depuis le fragment, on accède à l'élément carte à ajouter au DOM
    const newTagElement = clone.querySelector('.tag-elt');

    
    // on configure notre tag
    newTagElement.textContent = tagToCreate.name;
    newTagElement.dataset.tagId = tagToCreate.id;

    
    // on l'accroche dans le container de la carte du tag
    const cardId = tagToCreate.card_has_tag.card_id;
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const tagsContainerElement = cardElement.querySelector('.tags-elt');
    tagsContainerElement.append(newTagElement);


    // event listener :
    newTagElement.addEventListener('dblclick', tagModule.handleDeleteTagDblClick);

  },

  async handleDeleteTagDblClick(event){

    const tagElement = event.currentTarget;

    // on récupère les infos permettant de construire la requête HTTP
    const tagId = tagElement.dataset.tagId;
    const cardId = tagElement.closest('.card-elt').dataset.cardId;

    // envoyer la requête HTTP vers l'API
    const response = await fetch(`${utilsModule.baseUrl}/cards/${cardId}/tag/${tagId}`, { method: 'DELETE'});

    if (!response.ok){
      alert ('immpossible de supprimer le tag');
      return;
    }

    // MAJ de l'UI
    tagElement.remove();
    
  },

  
};

export default tagModule;