
/**
 * Variáveis de controle.
 */
const path = require('path')

function InsertCSSTagSpec (value)
{
  var styles = `
    body {
      visibility: `+ value +` !important;
    
      margin:0;
      overflow:hidden;
    }

    .auto
    {
      overflow:auto;
    }
    
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: #ddd;
    }

    ::-webkit-scrollbar-thumb {
      background: #26c6da; 
    }
  `;

  var styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

function ForceHiddenOnStartup ()
{
  InsertCSSTagSpec('hidden')
}

function ForceShowBody ()
{
  InsertCSSTagSpec('visible')
}

window.addEventListener('DOMContentLoaded', () => {
  ForceHiddenOnStartup()
});

window.addEventListener('dom-ready', () => {
  ForceHiddenOnStartup()
});

/**
 * Injeta jQuery.
 */
window.addEventListener('load', () => {
  ForceHiddenOnStartup()
  window.$ = window.jQuery = require(path.join(__dirname, '/js/jquery.min.js'));
  $(document).ready(()=>{
    Entry()
  })
});

/**
 * Inicialização.
 */
function Entry ()
{
  // Abre área onde ficam as declinações.
  $('.additional-data').slideToggle();

  // Remove header.
  $('.headerNavbar').css('display', 'none')
  $('.adContainer').css('display', 'none')
  
  // Remove áreas desnecessárias.
  var container = document.getElementsByClassName('container')
  container[0].style.display = 'none';
  container[1].style.display = 'none';
  container[3].style.display = 'none';

  ForceShowBody()

  // Envia sinal informando que o conteúdo já foi carregado.
  setTimeout(()=>{
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('webview-finished-load', window.location.href.toString().trim())

    // Fixa após a exibição.
    setTimeout(()=>{
      // Controle do scroll.
      var bodywidth = $('body').width();
      var scrollwidth = 10;
      $('body').mousemove(function(e){
        var x = e.pageX - this.offsetLeft;
        if(x>bodywidth-scrollwidth)
          $('body').addClass("auto");
        else
          $('body').removeClass("auto");
      });    
    }, 1000)
  }, 1000)
}
