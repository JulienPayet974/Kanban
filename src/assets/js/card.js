import tagModule from './tag.js';
import utilsModule from './utils.js';
import apiModule from './api.js';

const cardModule = {
  // Affichage de la modale d'ajout de carte
  showAddCardModal(event){
    event.preventDefault();

    // on récupère l'id de la liste sur laquelle on veut ajouter la carte
    const listOnWhichCreateTheCard = event.currentTarget.closest('.list-elt');
    const listId = listOnWhichCreateTheCard.dataset.listId;

    // on récupère la modale à ouvrir
    const addCardModal = document.getElementById('addCardModal');

    // depuis l'élément modal, on récupère l'élément qui a pour attrbut name list_id
    // et on postionne sa valeur avec l'id de la liste ou on va créer la carte
    addCardModal.querySelector('[name="list_id"]').value = listId;

    // on reset le formulaire
    addCardModal.querySelector('form').reset();

    // on affiche la modale
    addCardModal.classList.add('is-active');

  },

  // gestionnaire de la soumission du formulaire d'ajout de carte
  async handleAddCardForm(event){
    // evitons le rechargement de la page
    event.preventDefault();

    // on récupère le formulaire soumis
    const form = event.currentTarget;

    // on instancie un ojet formData depuis le formulaire
    const formData = new FormData(form);

    try{
      const newCard = await apiModule.createCard(formData);

      // on confie les données de la carte à créer à la méthode makeCardInDOM
      cardModule.makeCardInDOM(newCard);

      // on cache les modales
      utilsModule.hideModals();
    }catch (error){
      alert('erreur lors de l\'ajout de la carte');
    }    
  },

  // création de la carte dans le DOM
  async makeCardInDOM(cardToCreate){
    // on récupère l'id de la liste dans laquelle on souhaite créer la carte
    const listId = cardToCreate.list_id;

    // on récupère la liste dans laquelle on souhaite créer la carte
    // pour cea on utilise un sélecteur d'attribut
    // on sélection un élément dont l'attribut data-list-id a pour valeur l'id de la liste dans laquelle on souhaite créer la carte
    const listOnWhichCreateTheCard = document.querySelector(`[data-list-id="${listId}"]`);

    // on accède au container de cartes de la liste dans laquelle on souhaite créer la carte
    const cardContainerElement = listOnWhichCreateTheCard.querySelector('.cards-elt');

    // on accède au template de carte
    const templateCard = document.querySelector('#cardTemplate');
    // on clone le template de carte et on récupère un fragment de document
    const clone = document.importNode(templateCard.content, true);
    // depuis le fragment, on accède à l'élément carte à ajouter au DOM
    const newCardElement = clone.querySelector('.card-elt');

    // on met à jour l'élément à ajouter en précisant le contenu textuel de la carte
    newCardElement.querySelector('.card-elt__content').textContent = cardToCreate.content;

    // on met à jour l'élément à ajouter en appliquant la couleur choisie
    newCardElement.style.borderLeft = 'solid 5px';
    newCardElement.style.borderLeftColor = cardToCreate.color;

    // on met à jour le dataset de la carte pour y stocker son id
    newCardElement.dataset.cardId = cardToCreate.id;
    newCardElement.dataset.color = cardToCreate.color;

    // on ajoute la carte dans le conteneur de cartes  de la liste dans laquelle on souhaite créer la carte
    cardContainerElement.append(newCardElement);    

    // récupération de tous les tags
    const tags = await apiModule.getAllTags();

    const selectTagIdElement = newCardElement.querySelector('[name=tag_id]');

    tags.forEach(
      tag => {
        const optionElement = document.createElement('option');
        optionElement.textContent = tag.name;
        optionElement.value = tag.id;

        selectTagIdElement.append(optionElement);
      },
    ) 

    // création des tags associés
    if (cardToCreate.tags){
      cardToCreate.tags.forEach((tag) => tagModule.makeTagInDOM(tag));
    }

    // event listener :

    // suppression de la carte :
    // récupréation de l'élément d'interface avec lequel intéragir
    const deleteCardLink = newCardElement.querySelector('.deleteCardLink');
    // écoute de l'évènement click et association du gestionnaire d'évènement handleDeleteCardClick
    deleteCardLink.addEventListener('click', cardModule.handleDeleteCardClick);

    // édition de la carte :
    const editCardLinkElement = newCardElement.querySelector('.editCardLink');
    editCardLinkElement.addEventListener('click', cardModule.showEditCardModal);

    // ajout d'un tag
    const formAddTagElement = newCardElement.querySelector('.associateTagForm');
    formAddTagElement.addEventListener('submit', cardModule.handleAssociateTagForm);

  },

  // Affichage de la modale d'édition de carte
  showEditCardModal(event){
    event.preventDefault();

    // on récupère l'id de la carte pour laquelle on affiche le form d'édition
    const cardToUdpateElement = event.currentTarget.closest('.card-elt');
    const cardId = cardToUdpateElement.dataset.cardId;

    // on récupère la modale à ouvrir
    const editCardModal = document.getElementById('editCardModal');

    // depuis l'élément modal, on récupère l'élément qui a pour attrbut name card_id
    // et on postionne sa valeur avec l'id de la carte à modifier
    editCardModal.querySelector('[name="card_id"]').value = cardId;

    // on reset le formulaire
    addCardModal.querySelector('form').reset();

    // UX - On pré-remplit les champs
    const cardColor = cardToUdpateElement.dataset.color;
    const cardName = cardToUdpateElement.querySelector('.card-elt__content').textContent;
    editCardModal.querySelector('[name=content]').value = cardName;
    editCardModal.querySelector('[name=color]').value = cardColor;

    // on affiche la modale
    editCardModal.classList.add('is-active');

  },

  async handleEditCardForm(event){

    try{
      event.preventDefault();
      console.log('submit edit card');

      const formElement = event.target;
      const formData = new FormData(formElement);

      const cardId = formData.get('card_id');

      const response = await fetch(`${utilsModule.baseUrl}/cards/${cardId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok){
        alert ('Impossible de mettre à jour la carte');
        return;
      }

      const updatedCard = await response.json();

      // MAJ UI
      // on récupère la carte à mettre à jour dans le DOM
      const cardElement = document.querySelector(`[data-card-id="${updatedCard.id}"]`);
      cardElement.querySelector('.card-elt__content').textContent = updatedCard.content;
      // équivalent à :
      // const cardTitleElement = cardElement.querySelector('.card-elt__content');
      // cardTitleElement.textContent = updatedCard.content;

      cardElement.style.borderLeftColor = updatedCard.color;

      utilsModule.hideModals();
    }catch(error){      
      alert('Une erreur s\'est produite...');      
    }
  },

  async handleDeleteCardClick(event){
    event.preventDefault();

    // récupérer les éléments nécessaire dans le DOM pour la construction de la requête HTTP
    const clickedLink = event.currentTarget;
    const cardElement = clickedLink.closest('.card-elt');
    const cardId = Number(cardElement.dataset.cardId);

    try{
    
      // envoyer la requête api et récupérer la réponse
      const response = await fetch(`${utilsModule.baseUrl}/cards/${cardId}`, { method: 'DELETE'});

      // réponse autre que 2XX : on prévient du pb
      if (!response.ok){
        alert ('impossible de supprimer la carte');
        return;
      }

      // réponse 2XX : on met à jour l'UI (ici suppression de la carte)
      cardElement.remove();
    }catch(error){
      alert ('impossible de supprimer la carte');
    }
  },

  async handleAssociateTagForm(event){

    try{
      event.preventDefault();

      // récupération des infos pour la construction de la requête depuis le DOM
      const FormElement = event.currentTarget;
      const formData = new FormData(FormElement);
      const tagId = formData.get('tag_id');
      const cardId = FormElement.closest('.card-elt').dataset.cardId;

      const bodyFormData = new FormData();
      bodyFormData.append('tag_id', tagId);

      // envoie de la requête à l'API
      const response = await fetch(`${utilsModule.baseUrl}/cards/${cardId}/tag`, {
        method: 'POST',
        body: bodyFormData,
      });

      if (!response.ok){
        alert ('impossible d\'ajouter le tag');
        return;
      }

      // plusieurs manières de faire :
      // - récupérer les infos depuis le form et le dom et reconstruire,
      // -  modifier l'API pour récupérer ce que l'on veut,
      // - récupérer la carte et juste mettre à jour ce qu'il faut
      // - récupérer la carte, la supprimer du dom, la recréer à partir de celle reçue
      
      const responseCard = await fetch(`${utilsModule.baseUrl}/cards/${cardId}`);

      if (!responseCard.ok){
        alert ('impossible d\'ajouter le tag');
        return;
      }

      const card = await responseCard.json();

      // supprimer la carte
      const cardToDeleteElement = document.querySelector(`[data-card-id="${cardId}"]`);
      cardToDeleteElement.remove();

      // la recréer
      cardModule.makeCardInDOM(card);
    }catch(error){
      alert ('impossible d\'ajouter le tag');
    }
  },
};

export default cardModule;