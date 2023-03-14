import cardModule from './card.js';
import listModule from './list.js';
import utilsModule from './utils.js';

// on objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {    

    console.log('app.init !');

    utilsModule.checkBrowserCompatibility();

    listModule.init();

    // on écoute les évènements souhaités et on leur associe des gestionnaires d'évènement
    app.addListenerToActions();
  },

  addListenerToActions(){
    // Pour le click sur le bouton, 2 étapes :
    // 1 - récupérer l'élément sur lequel on souhaite écouter un évènement,
    const addListButtonElement =  document.getElementById('addListButton');

    // 2 - écouter l'évènement et associer le gestionnaire d'évènement
    addListButtonElement.addEventListener('click', listModule.showAddListModal);

    // Pour la fermeture des modales :
    // on peut se mettre en écoute des click sur les boutons close des modales
    // dès le lancament de l'application.

    const closeModalButtons = document.querySelectorAll('.modal .close');

    for (const closeModalButton of closeModalButtons){
      closeModalButton.addEventListener('click', utilsModule.hideModals);
    }

    // pour la soumission du formulaire d'ajout de liste :
    // - récupérer le formulaire,
    // - poser un écouteur d'évènement submit et indiquer le handler associé

    // rappel sur les sélecteur
    // div -> élément de type div
    // .div -> élément qui porte la classe div
    // #div -> élément qui a l'id div

    const addListFormElement = document.querySelector('#addListModal form');
    addListFormElement.addEventListener('submit', listModule.handleAddListForm);

    // pour l'ajout des cartes 
    const addCardLinkElements = document.querySelectorAll('.addCardLink');
    for (const addCardLinkElement of addCardLinkElements){
      addCardLinkElement.addEventListener('click', cardModule.showAddCardModal);
    }

     // pour la soumission du formulaire d'ajout de carte :
    const addCardFormElement = document.querySelector('#addCardModal form');
    addCardFormElement.addEventListener('submit', cardModule.handleAddCardForm);

    // pour la soumission du formulaire d'édition de carte :
    const editCardFormElement = document.querySelector('#editCardModal form');
    editCardFormElement.addEventListener('submit', cardModule.handleEditCardForm);

  },  

  
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );