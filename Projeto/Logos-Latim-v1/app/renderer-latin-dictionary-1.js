
/**
 * Variáveis de controle.
 */
const path = require('path')

function InsertCSSTagSpec (value)
{
  var styles = `
    body {
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
    
    html, body, div, table {
      background-color: white !important;
      color: black !important;
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
  // Configurações visuais.
  var els = document.getElementsByTagName('div')
  for (var a=0; a<11; a++)
    els[a].style.display = 'none'

  for (var a=12; a<22; a++)
    els[a].style.display = 'none'

  els[ els.length - 1 ].style.display = 'none'
  
  // Foca na área de exibição das informações sobre a palavra.
  els = document.getElementsByTagName('div')
  var found = false
  var elToFocus = null

  for (var a=0; a<els.length; a++)
  {
    if (els[a].id.toString().indexOf('wrapper') != -1)
    {
      els[a].scrollIntoView(true)
      elToFocus = els[a]
      found = true
      break
    }
  }

  // Não encontrou área de exibição das informações da palavra.
  // Provavelmente porque está na área da listagem, portanto foca na mesma.
  if (found == false)
  {
    els = document.getElementsByTagName('b')
    els[6].scrollIntoView(true)
    elToFocus = els[6]
  }

  ForceShowBody()

  // Envia sinal informando que o conteúdo já foi carregado.
  setTimeout(()=>{
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('webview-finished-load', window.location.href.toString().trim())

    // Fixa após a exibição.
    setTimeout(()=>{
      elToFocus.scrollIntoView(true)
      
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
