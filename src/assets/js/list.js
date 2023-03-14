// on a installé sortablejs en dépendance de notre projet
// on peut donc l'importer comme on le ferait en back !
import Sortable from 'sortablejs';

import utilsModule from './utils.js';
import apiModule from './api.js';
import cardModule from './card.js';


const listModule = {

  async init(){
    
    // en instanciant Sortable et en lui fournissant un élément du DOM
    // en argument du constructeur, cela rend l'élément triable (en fait on peut trier son contenu)
    new Sortable(document.querySelector('.lists-elt'), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: listModule.handleDropList,
    });
    
    try{
      const lists = await apiModule.getAllLists();

      console.log(lists);    

      // 2 - ajouter dans le DOM les listes existantes
      for (const list of lists){
        listModule.makeListInDOM(list);
      }
      
    }catch(error){
      console.log(error);
      alert("erreur : impossible de récupérer les listes...");
    }   
  },

  // gestionnaire de drop d'une liste (fin du dragg)
  async handleDropList(){
    console.log('drop');
    try{
      const listsElements = document.querySelectorAll('.list-elt');
      listsElements.forEach(
        async (listElement, index) => {
          // raisonnement pour trouver comment contacter l'api
          // besoin : changer l'ordre les listes
          // à faire : modifier les liste
          // comment : en envoyant un PATCH sur /lists/:id
          // de quoi on a besoin : id de la liste à modifier, position à lui attribuer
          
          // récupérer depuis le DOM les information permettant de préparer la requête
          const listId = listElement.dataset.listId;
          const position = index;

          const formData = new FormData();
          formData.append('id', listId);
          formData.append('position', position);

          // envoyer la requête
          await apiModule.updateList(formData);       
        }
      );
    }catch(error){
      console.log(error);
      alert('Problème lors du réordonnement des listes');
    }
  },

  // gestionnaire de l'évènement click sur le bouton d'ajout de liste
  showAddListModal(){
    console.log('clicked button');

    // 1 - Je récupère la modale
    const addListModalElement = document.getElementById('addListModal');
    // console.log(addListModalElement);

    // 2 - Je modifie la liste de classe de la modale pour ajouter la classe is-active
    // is-active est une classe prévue par bulma pour rendre visible une modale
    addListModalElement.classList.add('is-active');

    // on raz le formulaire (plus propre si on veut ajouter plusieurs listes)
    addListModalElement.querySelector('form').reset();
  },



  // gestionnaire de soumission du formulaire d'ajout de liste
  async handleAddListForm(event){
    event.preventDefault();
    console.log('soumission form addList');

    const addListFormElement = event.currentTarget;
    const addListFormData = new FormData(addListFormElement);
    
    // ici, plus besoin de d'extraire les données du formData dans un objet
    // on peut envoyer directement le fomData dans le body de la requête avec fetch.

    // Permet de récupérer un objet avec autant de propriété que le nombre de champs de formulaire.
    // - chaque propriété est nommée par le nom de chaque champ,
    // - chaque propriété contient la valeur associée.
    // const newListData = Object.fromEntries(addListFormData);

    // console.log(addListFormData.get('name'));
    // console.log(newListData);

    // on demande à la couchèle du front
    // la création de la nouvelle liste
    
    try{
      // on demande à la couche modèle de créer la liste
      // à partir des données du formulaire
      // et on s'attend à récupérer la liste créée
      const newList = await apiModule.createList(addListFormData);
      console.log(newList);

      // on ajoute au DOM la liste créée
      listModule.makeListInDOM(newList);

      // on masque la modale
      utilsModule.hideModals();
    }catch(error){
      alert('erreur lors de l\'ajout de la liste');
    }    
  },  

  // creation d'une liste dans le DOM
  makeListInDOM(listToCreate){
    const templateList = document.querySelector("#listTemplate");
    // on obtient ici un fragment HTML
    const clone = document.importNode(templateList.content, true);
    console.log('à ce stade, #document-fragment', clone);

    // on peut utiliser un query selector pour récupérer l'élement qui nous intéresse
    const newListElement = clone.querySelector('.list-elt');
    console.log('à ce stade, element du DOM comme d\'hab', newListElement);

    // on récupère l'emplacement dans le template ou on veut indiquer le nom de la liste
    const newListTitleElement = newListElement.querySelector('.list-elt__title');
    // on met à jour le contenu textuel de cet élément avec le titre de la liste à créer.
    newListTitleElement.textContent = listToCreate.name;

    // on consigne dans l'élément du DOM représentant la liste créée son id dans un attribut de données
    newListElement.dataset.listId = listToCreate.id;

    const listsElement = document.querySelector('.lists-elt');

    listsElement.append(newListElement);

    const cardsContainerElement = newListElement.querySelector('.cards-elt');

    new Sortable(
      cardsContainerElement, {
        group: 'cards', // tout les container de cartes peuvent s'échanger des cartes,
        onEnd: listModule.handleDropCard,
      }
    );

    if (listToCreate.cards){
      console.log(listToCreate.cards);

      // pour chacune des cartes de la liste, on crée cette dernière dans le DOM
      listToCreate.cards.forEach((card) => cardModule.makeCardInDOM(card));
    }    
    
    // équivalent en fonction classique :
    // listToCreate.cards.forEach(function (card){ cardModule.makeCardInDOM(card) });

    // eventListeners

    // ajout d'une carte
    const addCardLink = newListElement.querySelector('.addCardLink');
    addCardLink.addEventListener('click', cardModule.showAddCardModal);

    // suppression de la liste :
    const deleteListLink = newListElement.querySelector('.deleteListLink');
    deleteListLink.addEventListener('click', listModule.handleDeleteListClick);

    // double-click sur le titre
    const titleElement = newListElement.querySelector('.list-elt__title');
    titleElement.addEventListener('dblclick', listModule.showEditForm);

    // soumission du formulaire de mise à jour e la liste
    const formElement = newListElement.querySelector('.list-elt__edit-form');
    formElement.addEventListener('submit', listModule.handleEditListForm);
  },

  async handleDropCard(event){
    try{
      const destinationContainer = event.to;

      const destinationListElement = destinationContainer.closest('.list-elt');

      const listId = destinationListElement.dataset.listId;

      const cardsElements = destinationListElement.querySelectorAll('.card-elt');

      cardsElements.forEach(
        async (cardElement, index) => {

          // on prépare les données
          // listId, on l'a déjà sous ce nom
          const cardId = cardElement.dataset.cardId;
          const position = index;

          const formData = new FormData();
          formData.append('id', cardId);
          formData.append('position', position);
          formData.append('list_id', listId);

          // appeler l'api
          await apiModule.updateCard(formData);
        }
      );
    }catch(error){
      console.log(error);
      alert ('impossible de réordonner les cartes');
    }
  },

  async handleDeleteListClick(event){
    event.preventDefault();

    // récupérer les élément permettant de construire la requête
    const clickedLink = event.currentTarget;
    const listToDelete = clickedLink.closest('.list-elt');
    const listId = listToDelete.dataset.listId;

    // envoyer la requête
    try{
      await apiModule.deleteList(listId);
      // mettre à jour l'UI
      listToDelete.remove();
    }catch(error){
      // prévenir l'utilisateur
      alert('impossible de supprimer la liste');
    }
  },

  showEditForm(event){
    // on récupère l'élément double-clické
    const titleElement = event.currentTarget;

    // on remonte à la liste
    const listElement = titleElement.closest('.list-elt');
    // on redescend au form
    const formElement = listElement.querySelector('.list-elt__edit-form');

    // on fait disparaitre le titre
    titleElement.classList.add('is-hidden');

    // on affiche le form
    formElement.classList.remove('is-hidden');

    // on reset le form
    formElement.reset();

    // on met à jour le champ caché list_id dans le form
    // explication sur le sélecteur : qui possède un arrticut name qui a la valeur lis_id
    formElement.querySelector('[name=list_id]').value = listElement.dataset.listId;

    // on donne le focus au champ de saisi et on remet le titre (UX)
    const inputNameElement = formElement.querySelector('[name=name]');
    inputNameElement.value = titleElement.textContent;
    inputNameElement.focus();
    inputNameElement.select();

  },

  async handleEditListForm(event){
    
   try{
      event.preventDefault();

      const formElement = event.target;

      // la dedans on à list_id et sa valeur, name et sa valeur
      const formData = new FormData(formElement);

      // on récupère le list_id depuis le formdata
      const listId = formData.get('list_id');

      // on demande à l'api la mise à jour de la liste
      // et on récupère la réponse
      const response = await fetch(`${utilsModule.baseUrl}/${listId}`, {
        method: 'PATCH',
        body: formData,
      });

      // on accède à l'élément du DOM qui contient le titre de la liste
      const titleElement = formElement.closest('.list-elt').querySelector('.list-elt__title');

      // si l'api nous indique un pb (code différent de 2XX)
      if (!response.ok){
        alert('Une erreur s\'est produite...');
      }

      // si la mise à jour s'est faite (api répond 2XX)
      if (response.ok){
        // on récupère les données renvoyées par l'api
        const listData = await response.json();

        // on met à jour le titre de la liste dans le dom
        // avec le titre renvoyé par l'api
        const newListTitle = listData.name;
        titleElement.textContent = newListTitle;        
      }

      // on masque le form
      formElement.classList.add('is-hidden');
      // on affiche le titre
      titleElement.classList.remove('is-hidden');

    }catch(error){
      // en cas de grosse erreur (l'api ne répond pas)
      // on affiche juste un message
      // à priori, si l'api est plantée, notre site
      // va avoir du mal à fonctionner
      alert('Une erreur s\'est produite...');      
    }

  },

};

export default listModule;