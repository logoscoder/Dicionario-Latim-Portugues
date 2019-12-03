
/**
 * Variáveis de controle.
 */
const path = require('path')

/**
 * Configurações visuais.
 */
function InsertCSSTagSpec ()
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
    
    html, body, div {
      
    }
  `;

  var styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

window.addEventListener('DOMContentLoaded', () => {
  InsertCSSTagSpec()
});

window.addEventListener('dom-ready', () => {
  InsertCSSTagSpec()
});

/**
 * Injeta jQuery.
 */
window.addEventListener('load', () => {
  InsertCSSTagSpec()
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
  // Processamento.
  var url = window.location.href.toString().trim()
  if (!url || url == null || url == undefined || url.toString().length <= 0)
    return false

  /**
   * Dicionário latino/italiano.
   */
  if (url.indexOf('www.dizionario-latino.com') != -1)
  {
    setTimeout(()=>{
      // Configurações visuais.
      var els = document.getElementsByTagName('div')
      for (var a=0; a<11; a++)
        els[a].style.display = 'none'

      for (var a=12; a<22; a++)
        els[a].style.display = 'none'

      els[ els.length - 1 ].style.display = 'none'

      var found = false
    
      // Página das informações de declinações.
      // Foca na área de exibição das informações sobre as declinações.
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
        }
      }
    }, 2000)
  }

  /**
   * Foca na área do resultado.
   */
  if (url.indexOf('latin-dictionary.net') != -1)
  {
    document.getElementById('search-results-list').scrollIntoView(true)
  }

  /**
   * Processa busca (o site utiliza o método POST).
   */
  if (url.indexOf('www.mobot.org') != -1 && url.indexOf('s=') != -1)
  {
    var searchWord = url.split('s='), searchWord = searchWord[1].toString().trim()
    document.getElementById('txtSearch').value = searchWord
    setTimeout(()=>{
      $('input[name=btnSearch]').click()
      setTimeout(()=>{
        document.getElementById('UpdatePanel1').scrollIntoView(true)
      }, 1000)
    }, 1000)
  }
  
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
