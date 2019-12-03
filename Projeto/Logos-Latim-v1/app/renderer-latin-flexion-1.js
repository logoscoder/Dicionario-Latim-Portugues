
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
      overflow:hidden !important;
    }

    .auto
    {
      overflow:auto !important;
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

  // Página de navegação.
  // Verifica se tem informações sobre as declinações.
  var found = false
  var els = document.getElementsByTagName('a')

  for (var a=0; a<els.length; a++)
  {
    if (els[a].innerHTML.toString().indexOf('View the declension of this word') != -1) {
      window.location.href = els[a].href
      found = true
      break
    }
  }

  // Nao encontrou especificações
  if (found == false)
  {
  }

  found = false
  var elToFocus = null

  // Página das informações de declinações.
  // Foca na área de exibição das informações sobre as declinações.
  if (window.location.href.toString().indexOf('flexion.php') != -1)
  {
    els = document.getElementsByTagName('div')
    
    // Remove ads.
    for (var a=0; a<els.length; a++)
    {
      if (els[a].id.toString().indexOf('ads_right') != -1)
      {
        els[a].innerHTML = ''
      }
    }

    // Foca.
    for (var a=0; a<els.length; a++)
    {
      if (els[a].id.toString().indexOf('wrapper') != -1)
      {
        var node = document.createElement('div'); 
        els[a].appendChild(node)
        node.scrollIntoView(true)
        found = true
        elToFocus = node
        ForceShowBody()
        break
      }
    }
  }
  
  // Não encontrou área de exibição das informações da palavra.
  // Provavelmente porque está na área da listagem, portanto foca na mesma.
  if (found == false)
  {
    if ( $('body').text().toString().indexOf('The search for') != -1 && 
         $('body').text().toString().indexOf('returned the following results') != -1 )
    {
      els = document.getElementsByTagName('b')
      els[6].scrollIntoView(true)
      elToFocus = els[6]
      ForceShowBody()
    }
  }

  // Envia sinal informando que o conteúdo já foi carregado.
  if (window.location.href.toString().indexOf('nosend-flag') == -1)
  {
  }

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
