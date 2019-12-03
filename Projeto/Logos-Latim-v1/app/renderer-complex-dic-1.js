
/**
 * Variáveis de controle.
 */
const path = require('path')
var intervalCheckWorker = null
var intervalUseWorker = false
var currentWord = null
var recheckLimit = 5; // Limite de tentativas de extração dos dados.
var recheckLimitCounter = 0

/**
 * Injeta jQuery.
 */
window.addEventListener('load', () => {
  window.$ = window.jQuery = require(path.join(__dirname, '/js/jquery.min.js'));
  $(document).ready(()=>{
    
    /**
     * Processamento.
     */
    intervalCheckWorker = setInterval(()=>{
      if (intervalUseWorker == false) {
        intervalUseWorker = true
        recheckLimitCounter++

        /**
         * Verifica se está na página que contêm a listagem de algumas opções de termos, se sim, clica no primeiro.
         */
        var validRequest = true

        if ( $('body').text().toString().indexOf('The search for') != -1 && 
              $('body').text().toString().indexOf('returned the following results') != -1 )
        {
          var els = document.getElementsByClassName('br_english')
          if (els) 
            if (els[0]) {
              els = els[0].getElementsByTagName('a')
              if (els)
                if (els[0]) 
                  if (els[0].href) {
                    window.location.href = els[0].href;
                    validRequest = false
                  }
            }

          if (validRequest == true)
          {
            var l = document.links;
            for (var i=0; i<l.length; i++) {
              if (l[i].href.toString().indexOf('lemma=') != -1) {
                window.location.href = l[i].href;
                validRequest = false
              }
            }
          }
        }

        if (validRequest == false)
          return false;

        /**
         * Limite de checagens excedido.
         */
        if (recheckLimitCounter >= recheckLimit)
        {
          const { ipcRenderer } = require('electron')
          
          ipcRenderer.send('grab-information-word-1', {
            status: 'cancel-operation'
          })

          clearInterval(intervalCheckWorker)
        }

        /**
         * Puxa informações.
         */
        var defination = ''
        var grammatica = ''
        var translations = []

        {
          var els = document.getElementById('myth')
          if (els) {
            els = els.getElementsByTagName('*')
            if (els)
            if (els.length) {
              for (var a=0; a<els.length; a++) {
                if (els[a])
                if (els[a].className)
                {
                  // Puxa valor contido na definição.
                  if (els[a].className == 'lemma') {
                    var content = els[a].innerText.toString().trim()
                    if (content.length <= 0)
                      content = els[a].innerHTML.toString().trim()
                      defination = content
                  }

                  // Puxa campo 'grammatica'
                  else if (els[a].className == 'grammatica') {
                    var content = els[a].innerText.toString().trim()
                    if (content.length <= 0)
                      content = els[a].innerHTML.toString().trim()
                    grammatica = content
                  }

                  // Puxa campo das definições.
                  else if (els[a].className == 'english') {
                    var content = els[a].innerText.toString().trim()
                    if (content.length <= 0)
                      content = els[a].innerHTML.toString().trim()
                    translations.push({
                      en: content,
                      pt: ''
                    })
                  }
                }
              }
            }
          }
        }
        
        // Validação.
        if (!defination || defination == null || defination == undefined || defination == false ||
            !grammatica || grammatica == null || grammatica == undefined || grammatica == false ||
            translations.length <= 0) 
        {
          intervalUseWorker = false
        }

        /**
         * Dados prontos, envia-os para IPC.
         */
        else 
        {
          const { ipcRenderer } = require('electron')
          
          ipcRenderer.send('grab-information-word-1', {
            status: 'success',
            defination: defination,
            grammatica: grammatica,
            grammaticaPt: '',
            translations: translations
          })

          clearInterval(intervalCheckWorker)
        }
      }
    }, 100)
  })
});
