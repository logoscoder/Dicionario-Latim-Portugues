
/**
 * Variáveis de controle.
 */
const path = require('path')
var intervalCheckTranslation = null
var intervalUseTranslation = false

/**
 * Injeta jQuery.
 */
window.addEventListener('load', () => {
  window.$ = window.jQuery = require(path.join(__dirname, '/js/jquery.min.js'));
  $(document).ready(()=>{
    
    /**
     * Verifica se já foi traduzido.
     */
    intervalCheckTranslation = setInterval(()=>{
      if (intervalUseTranslation == false) {
        intervalUseTranslation = true

        var textTranslated = $('.tlid-translation.translation').text()
        if (!textTranslated || textTranslated == null || textTranslated == undefined || textTranslated == false) {
          intervalUseTranslation = false
        }

        /**
         * Texto traduzido, processa-o.
         */
        else 
        {
          const { ipcRenderer } = require('electron')
          ipcRenderer.send('google-translate-finished-word', textTranslated)
        }
      }
    }, 100)
  })
});
