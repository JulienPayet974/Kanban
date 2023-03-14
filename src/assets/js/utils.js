const utilsModule = {
    baseUrl: process.env.API_BASE_URL,
  
    checkBrowserCompatibility(){
      if (!"content" in document.createElement("template")){
        alert('navigateur imcompatible avec notre application');
      }
    },
  
    // fermeture de toutes les modales
    hideModals(event){    
      const modalElements = document.querySelectorAll('.modal');
  
      for (const modalElement of modalElements){
        modalElement.classList.remove('is-active');
      }    
  
      // on aurait aussi pu faire :
      /*
      const clickedButton = event.currentTarget;
      const modalToCloseElement = clickedButton.closest('.modal');
      modalToCloseElement.classList.remove('is-active');
      */
    },
  
  };
  
  export default utilsModule;