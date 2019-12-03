
$(document).ready(() => {
  console.log('Deus eh Lindo!');
})

/**
 * Controle da randomização das frases de louvor a nosso Lindo Deus, nosso Senhor Jesus Cristo.
 */
$(document).ready(()=>{
  GetRandLogosText()
})

function GetRandLogosText ()
{
  var frases = [
    'In principio erat Verbum et Verbum erat apud Deum et Deus erat Verbum',
    'Luz do meu ser',
    'Amor que se fez carne',
    'Homem nascido sem homem',
    'Razão do meu viver',
    'Sabedoria encarnada',
    'Princípio da sabedoria',
    'Fundamento da minha existência',
    'Ente dos entes',
    'Sustentáculo de tudo quanto há',
    'Criador transpassado pelas criaturas',
    'Mãos criadoras transpassadas por mãos criadas',
    'Aquele que venceu a morte',
    'Juiz misericordioso',
    'Divina Misericórdia',
    'Santíssima Trindade',
    'Deus Trino em Deus Uno',
    'Beleza em Si Mesma',
    'Caminho, Verdade e Vida',
    'Vida da minha alma',
    'Caminho do meu viver',
    'Verdade das verdades',
    'Suprema Perfeição',
    'Pão dos Anjos',
    'Pão dos Céus',
    'Alegria dos Homens',
    'Santo dos Santos',
    'Luz da minha vida',
    'Máxima Bondade',
    'Existência da existência',
    'Eterno Amor',
    'Reconciliador',
    'Eterno Corpo e Alma',
    'Restaurador da Ordem',
    'Divino Filho',
    'Verdadeiro Deus e Verdadeiro Homem',
    'Transubstância',
    'Juiz Universal',
    'Rei dos reis',
    'Justo dos justos',
    'Senhor dos senhores',
    'Agua da vida',
    'O Inefável',
    'O Alfa e o Ômega',
    'Menino Deus'
  ];

  var randNum = Math.floor(Math.random() * frases.length )
  randNum = parseInt(randNum)

  $('#start-title-text').text( frases[randNum] )
  $('#start-results-text').text( frases[randNum] )
}

/**
 * Controle geral da aplicação.
 */
var ProcessRunBlocked = true
const { ipcRenderer } = require('electron')
var fs = require('fs'), path = require('path')

$(document).ready(() => {

  /**
   * Controle da tradução da área inicial.
   */
  $('#btn-start-translate').on('click', ()=>{
    $('#field-start-text-results').val('')

    // Validações.
    if ( $('#field-start-text').val().length <= 0 ) {
      alert('Digite algo para realizar a busca!')
      $('#field-start-text').focus()
      return false
    }

    // Configurações visuais.
    HideAreas()
    ShowAreaByClass('area-div-results')
    $('#results-original-text').text( 'Traduzindo...' )
    $('#results-translate-all').text('Traduzindo...')
    $('#results-translate-unique').text('Traduzindo...')
    ResetWebViewsFull()
    ShowResultsArea1()

    currentTextToProcessTranslate = $('#field-start-text').val().toString().trim()
    $('#field-start-text-results').val(currentTextToProcessTranslate)
    StartTranslationProcess()
  })

  /**
   * Controle da tradução da área de resultados.
   */
  $('#btn-start-translate-results').on('click', ()=>{
    StartProcessTranslateByResultsArea()
  })

  $('#field-start-text-results').enterKey(function () {
    StartProcessTranslateByResultsArea()
  })

  /**
   * Botão de voltar a página inicial.
   */
  $('#btn-results-back').on('click', ()=>{
    HideAreas()
    ShowAreaByClass('area-div-start')
    ProcessRunBlocked = true
    GetRandLogosText()
  })
})

/**
 * Controle de tradução a partir da área de resultados.
 */
function StartProcessTranslateByResultsArea ()
{
  // Validações.
  if ( $('#field-start-text-results').val().length <= 0 ) {
    alert('Digite algo para realizar a busca!')
    $('#field-start-text-results').focus()
    return false
  }

  // Configurações visuais.
  HideAreas()
  ShowAreaByClass('area-div-results')
  $('#results-original-text').text( 'Traduzindo...' )
  $('#results-translate-all').text('Traduzindo...')
  $('#results-translate-unique').text('Traduzindo...')
  ResetWebViewsFull()
  ShowResultsArea1()

  currentTextToProcessTranslate = $('#field-start-text-results').val().toString().trim()
  StartTranslationProcess()
}

/** 
 * Exibe área dos resultados interna.
 * Na inicialização da aplicação essa área fica oculta, e é exibida quando realizada a pesquisa. 
 */
function ShowResultsArea1 ()
{
  $('.results-area-all-1').css('display', 'block')
  $('.results-area-all-2').css('display', 'none')
}

/**
 * Inicia tradução.
 */
var currentTextToProcessTranslate = ''

function StartTranslationProcess ()
{
  ProcessRunBlocked = false
  GetRandLogosText()

  /**
   * Realiza processamento dos click's no texto original.
   */
  ProcessOriginalTextClick()

  /**
   * Realiza tradução simplificada.
   */
  ProcessStartTranslation()

  /**
   * Realiza processo de tradução complexa.
   */
  ProcessComplexTranslation()
}

/**
 * Controle de erro da API do Google.
 */
var GoogleAPIControlError = false

/**
 * Controle da tradução.
 */
function ProcessStartTranslation ()
{
  /**
   * Controle de tradução via Google.
   */
  
  // Reseta flag de controle de dupla execução da tradução via WebSite ao ocorrer erro na API do Google.
  ProcessGlobalControlRunningGTWS = false

  // Realiza tradução pela API do Google.
  if (GoogleAPIControlError == false) {
    GoogleTranslateAllText(currentTextToProcessTranslate)
    GoogleTranslateWordsText(currentTextToProcessTranslate)
  }
  
  // Realiza tradução pelo WebSite do Google Translate.
  else {
    ProcessTranslationByGoogleTranslateWebSite()
  }
}

/**
 * Realiza tradução do latim para português.
 * Utilizando API do Google Translate.
 */
function GoogleTranslateAllText (text)
{
  if (GoogleAPIControlError == true)
    return false;
  
  const net = require('net');
  if (net) {
    var socketClient = require('net').connect({
      host: 'translate.googleapis.com', port: 80
    }, () => {
      var data = encodeURI(text);
      
      var header = 
        "GET /translate_a/single?client=gtx&sl=la&tl=pt-br&dt=t&q="+ data +" HTTP/1.1\r\n" +
        "Host: translate.googleapis.com\r\n"+
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36\r\n"+
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"+
        "Connection: close\r\n\r\n";
        
      socketClient.write(header);
    });
    
    var responseFinal = "";
    socketClient.on('data', (data) => {
      responseFinal += data;
    });
    
    socketClient.on('end', () => {
      
      // Erro ao traduzir.
      if (responseFinal.indexOf('<body') != -1)
      {
        //$('#results-translate-all').text('A API do Google está dando erro no momento.')
        GoogleAPIControlError = true
        ProcessTranslationByGoogleTranslateWebSite()
        return false
      }
      
      // Traduzido com sucesso.
      var response = null, obj = null, status = false 
      response = responseFinal.split("\r\n\r\n")
      response = response[1].toString().trim()
      obj = JSON.parse(response)

      if (obj)
        if (obj[0])
          if (obj[0][0])
            if (obj[0][0][0])
              status = true

      if (status == false) {
        GoogleAPIControlError = true
        ProcessTranslationByGoogleTranslateWebSite()
      }
      else
      {
        var finalTranslated = ''
        for (var a=0; a<obj[0].length; a++)
          finalTranslated += obj[0][a][0] + ' '

        $('#results-translate-all').text(finalTranslated);
      }
    });
  }
}

/**
 * Realiza tradução por palavras.
 * Utilizando API do Google Translate.
 */
var currentWords = []
var intervalTranslation = null
var intervalTranslationOn = false
var currentWordIndex = 0
var finalBufferWordsTranslation = ''

function GoogleTranslateWordsText (text)
{
  if (GoogleAPIControlError == true)
    return false;
  
  /**
   * Quebra em palavras.
   */

  // Reseta variáveis de controle.
  currentWords = []
  finalBufferWordsTranslation = ''
  intervalTranslationOn = false
  currentWordIndex = 0

  // Contêm apenas uma palavra.
  if (text.indexOf(' ') == -1) 
  {
    currentWords.push({
      word: text.toString().trim(),
      translation: ''
    })
  }

  // Contêm várias palavras.
  else {
    var parts = text.split(' ')
    for (var a=0; a<parts.length; a++) {
      if (parts[a].toString().trim().length > 0) {
        currentWords.push({
          word: parts[a].toString().trim(),
          translation: ''
        })
      }
    }
  }

  if (currentWords.length <= 0) {
    alert('Erro ao realizar tradução.')
    return false
  }

  /**
   * Realiza tradução das palavras do array.
   */
  if (intervalTranslation != undefined && intervalTranslation != null)
    clearInterval(intervalTranslation)
  intervalTranslation = setInterval(()=>{

    // Cancela operação.
    if (ProcessRunBlocked == true) {
      clearInterval(intervalTranslation)
    }

    if (intervalTranslationOn == false) {
      intervalTranslationOn = true

      // Adina existe palavras para traduzir.
      if (currentWordIndex < currentWords.length)
      {
        const net = require('net');
        if (net) {
          var socketClient = require('net').connect({
            host: 'translate.googleapis.com', port: 80
          }, () => {
            var data = encodeURI( currentWords[ currentWordIndex ].word.toString().toLowerCase() );

            var header = 
              "GET /translate_a/single?client=gtx&sl=la&tl=pt-br&dt=t&q="+ data +" HTTP/1.1\r\n" +
              "Host: translate.googleapis.com\r\n"+
              "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36\r\n"+
              "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"+
              "Connection: close\r\n\r\n";
              
            socketClient.write(header);
          });
          
          var responseFinal = "";
          socketClient.on('data', (data) => {
            responseFinal += data;
          });
          
          socketClient.on('end', () => {
            
            // Erro ao traduzir.
            if (responseFinal.indexOf('<body') != -1)
            {
              //$('#results-translate-unique').html('A API do Google está dando erro no momento.')
              GoogleAPIControlError = true
              ProcessTranslationByGoogleTranslateWebSite()
              clearInterval(intervalTranslation)
              return false
            }
            
            // Traduzido com sucesso.
            var response = null, obj = null, status = false 
            response = responseFinal.split("\r\n\r\n")
            response = response[1].toString().trim()
            obj = JSON.parse(response)

            if (obj)
              if (obj[0])
                if (obj[0][0])
                  if (obj[0][0][0])
                    status = true

            var word = '[erro]'
            if (status == true)
            {
              // Adiciona no array de controle da tradução.
              word = obj[0][0][0]
              currentWords[ currentWordIndex ].translation = word

              // Incrementa contagem das palavras.
              currentWordIndex++

              // Processa dados existentes.
              ProcessGoogleTranslationWords('...')

              // Especifica que já concluiu a tarefa, para realizar a tarefa seguinte.
              setTimeout(()=>{
                intervalTranslationOn = false
              }, 100)
            }
          });
        }
      }

      /**
       * Não existe mais palavras para traduzir.
       * Portanto processa exibição das informações.
       */
      else 
      {
        // Processa dados existentes.
        ProcessGoogleTranslationWords('')

        // Fecha internal.
        clearInterval(intervalTranslation)
      }
    }
  }, 100)
}

/**
 * Processa tradução através do WebSite do Google Translate.
 * Traduzindo primeiro o texto completo, e depois palavra por palavra.
 */
var ProcessGTWB = null
var ProcessGTWBFinished = 0
var ProcessGlobalControlRunningGTWS = false

function ProcessTranslationByGoogleTranslateWebSite ()
{
  // Controle para evitar dupla execução quando ocorrer erro na API do Google.
  if (ProcessGlobalControlRunningGTWS == true)
    return false
  if (ProcessGlobalControlRunningGTWS == false)
    ProcessGlobalControlRunningGTWS = true

  console.log('Traduzindo via WebSite...')

  // Reseta.
  $('#results-translate-all').text('Traduzindo...')
  $('#results-translate-unique').text('Traduzindo...')

  /**
   * Traduz frase completa.
   */
  GoogleTranslateAllTextByWebSite(currentTextToProcessTranslate)
  
  /**
   * Traduz palavra por palavra.
   */
  if (ProcessGTWB != null)
    clearInterval(ProcessGTWB)

  ProcessGTWB = setInterval(()=>{

    // Cancela operação.
    if (ProcessRunBlocked == true) {
      clearInterval(ProcessGTWB)
    }

    // Tradução do texto completa finalizada, portanto traduz palavra por palavra.
    if (ProcessGTWBFinished == 1) {
      ProcessGTWBFinished = 0
      GoogleTranslateWordsTextByWebSite(currentTextToProcessTranslate)
    }

    // Os dois modos de traduzir foram completados, portanto finaliza interval.
    else if (ProcessGTWBFinished == 2) {
      ProcessGTWBFinished = 0
      clearInterval(ProcessGTWB)
    }
  }, 100)
}

/**
 * Realiza tradução do latim para português.
 * Utilizando website do Google Translate.
 */
var intervalCheckGoogleTWS = null

function GoogleTranslateAllTextByWebSite (text)
{
  var url = 'https://translate.google.com/#view=home&op=translate&sl=la&tl=pt&text='+ encodeURI(text)
  $('.bg-process-div').html(
    '<webview src="'+ url +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:640px; height:480px" preload="./renderer-google-text.js" ></webview>')

  if (intervalCheckGoogleTWS != null)
    clearInterval(intervalCheckGoogleTWS)
  intervalCheckGoogleTWS = setInterval(()=>{
    ipcRenderer.send('google-translate-finished-text-check', 'check')
  }, 100)
}

/**
 * Realiza tradução por palavras.
 * Utilizando Google Translate via WebSite.
 */
function GoogleTranslateWordsTextByWebSite (text)
{
  /**
   * Quebra em palavras.
   */

  // Reseta variáveis de controle.
  currentWords = []
  finalBufferWordsTranslation = ''
  intervalTranslationOn = false
  currentWordIndex = 0

  // Contêm apenas uma palavra.
  if (text.indexOf(' ') == -1) 
  {
    currentWords.push({
      word: text.toString().trim(),
      translation: ''
    })
  }

  // Contêm várias palavras.
  else {
    var parts = text.split(' ')
    for (var a=0; a<parts.length; a++) {
      if (parts[a].toString().trim().length > 0) {
        currentWords.push({
          word: parts[a].toString().trim(),
          translation: ''
        })
      }
    }
  }

  if (currentWords.length <= 0) {
    alert('Erro ao realizar tradução.')
    return false
  }

  /**
   * Realiza tradução das palavras do array.
   */
  if (intervalTranslation != undefined && intervalTranslation != null)
    clearInterval(intervalTranslation)
  intervalTranslation = setInterval(()=>{
    
    // Cancela operação.
    if (ProcessRunBlocked == true) {
      clearInterval(intervalTranslation)
    }

    if (intervalTranslationOn == false) {
      intervalTranslationOn = true

      // Adina existe palavras para traduzir.
      if (currentWordIndex < currentWords.length)
      {
        var plainWord = currentWords[ currentWordIndex ].word.toString().toLowerCase()
        var word = encodeURI(plainWord)
        var url = 'https://translate.google.com/#view=home&op=translate&sl=la&tl=pt&text='+ word

        $('.bg-process-div').html(
          '<webview src="'+ url +'" nodeintegration '+
          ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
          ' style="width:640px; height:480px" preload="./renderer-google-word.js" ></webview>')
      
        if (intervalCheckGoogleTWS != null && intervalCheckGoogleTWS != undefined)
          clearInterval(intervalCheckGoogleTWS)
        intervalCheckGoogleTWS = setInterval(()=>{
          ipcRenderer.send('google-translate-finished-word-check', 'check')
        }, 100)
      }

      /**
       * Não existe mais palavras para traduzir.
       * Portanto processa exibição das informações.
       */
      else 
      {
        // Processa dados existentes.
        ProcessGoogleTranslationWords('')

        // Sinaliza para o controlador geral dos dois modos de tradução, que pode finalizar o seu interval.
        ProcessGTWBFinished = 2

        // Fecha internal.
        clearInterval(intervalTranslation)
      }
    }
  }, 100)
}

function ProcessGoogleTranslationWords (sufix)
{
  // Monta buffer completo.
  var finalBufferWordsTranslation = ''
  for (var a=0; a<currentWords.length; a++) 
    finalBufferWordsTranslation += currentWords[a].translation + ' '
  finalBufferWordsTranslation += sufix

  // Monta table das palavras e suas respectivas traduções.
  var htmlTable = '<div class="results-table-div" ><table width="100%" cellspacing="0" cellpadding="0" border="0" >'
  var bgColor = '#dddddd'

  for (var a=0; a<currentWords.length; a++) 
  {
    htmlTable += "<tr style='background-color:"+ bgColor +";' >"
    htmlTable += "<td class='results-translate-unique-table' >"+ currentWords[a].word +"</td>"
    htmlTable += "<td class='results-translate-unique-table' >"+ currentWords[a].translation +"</td>"
    htmlTable += "</tr>"
  
    if (bgColor == '#dddddd')
      bgColor = ''
    else
      bgColor = '#dddddd'
  }

  htmlTable += "</table></div>"

  // Exibe buffer traduzido.
  $('#results-translate-unique').html(finalBufferWordsTranslation +'<hr>'+ htmlTable)
}

/**
 * Controle da resposta do IPC.
 */
$(document).ready(()=>{
  
  // Tradução do texto por inteiro.
  ipcRenderer.on('google-translate-finished-text-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.toString().trim().length > 0)
        {
          console.log('Translated: '+ arg)
          $('#results-translate-all').text(arg)
          ProcessGTWBFinished = true
          
          clearInterval(intervalCheckGoogleTWS)
        }
  })

  // Tradução de palavra por palavra.
  ipcRenderer.on('google-translate-finished-word-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.toString().trim().length > 0)
        {
          console.log('Translated: '+ arg)
          
          /**
           * Tradução da palavra finalizada, sinaliza para ir para a próxima da lista.
           */
          currentWords[ currentWordIndex ].translation = arg

          // Incrementa contagem das palavras.
          currentWordIndex++

          // Especifica que já concluiu a tarefa, para realizar a tarefa seguinte.
          intervalTranslationOn = false
          
          // Processa dados existentes.
          ProcessGoogleTranslationWords('...')

          // Finaliza checagem do IPC...
          clearInterval(intervalCheckGoogleTWS)
        }
  })
})

/**
 * Realiza processamento do click no texto original.
 */
function ProcessOriginalTextClick ()
{
  // Validações.
  var text = currentTextToProcessTranslate
  if (text.length <= 0) {
    alert('Erro ao processar texto.')
    HideAreas()
    ShowAreaByClass('area-div-start')
    ProcessRunBlocked = true
    return false
  }

  // Organiza.
  text = text.replace(/\r/g, ' ');
  text = text.replace(/\n/g, ' ');
  text = text.replace(/\t/g, ' ');
  text = text.replace(/\v/g, ' ');

  var partsRaw = text.split(' '), parts = []

  for (var a=0; a<partsRaw.length; a++) {
    if (partsRaw[a].toString().trim().length > 0) {
      parts.push( partsRaw[a].toString().trim() )
    }
  }

  // Formata HTML.
  var html = ''

  for (var a=0; a<parts.length; a++)
  {
    html += '<span class="results-original-text-item" id="word-results-id-'+ a +'" onclick="javascript:ProcessUniqueWord(\''+ a +'\', \''+ parts[a] +'\');">'+ parts[a] +'</span> '
  }

  $('#results-original-text').html(html)
  setTimeout((parts)=>{
    ProcessUniqueWord('0', parts[0])
  }, 1000, parts)
}

/**
 * Controle da checagem das URL's carregadas no WebView. 
 */
var intervalURLLoadedCheck = null
var loadedURLControlList = []

$(document).ready(()=>{
  ipcRenderer.on('webview-finished-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.length > 0)
        {
          // Processa.
          for (var a=0; a<arg.length; a++) {
            var found = false
            for (var b=0; b<loadedURLControlList.length; b++) {
              if (arg[a] == loadedURLControlList[b]) {
                found = true
                break
              }
            }
            if (found == false) {
              loadedURLControlList.push(arg[a])
              var url = arg[a]

              /**
               * Processa, exibe WebView's...
               */
              console.log('URL loaded: '+ url)

              // Glosbe.
              if (url.indexOf('glosbe.com') != -1) {
                $('.wb-glosbe').css('display', 'none')
                $('#webview-glosbe').css('display', 'block')
              }
              
              // Dicionário.
              else if (
                url.indexOf('www.online-latin-dictionary.com/latin-english-dictionary.php') != -1 &&
                url.indexOf('nosend-flag') == -1
              )
              {
                $('.wb-dic-a').css('display', 'none')
                $('#webview-online-latin-dictionary').css('display', 'block')
              }

              // Flexion.
              else if (
                url.indexOf('www.online-latin-dictionary.com/latin-dictionary-flexion.php') != -1 || 
                url.indexOf('nosend-flag') != -1 ) 
              {
                $('.wb-dic-b').css('display', 'none')
                $('#webview-online-latin-flexion').css('display', 'block')
              }

              // Páginas, dicionários...
              else if (url.indexOf('alatius.com') != -1) {
                $('.wb-dic-1').css('display', 'none')
                $('#webview-dic-a-1').css('display', 'block')
              } else if (url.indexOf('la.wiktionary.org') != -1) {
                $('.wb-dic-2').css('display', 'none')
                $('#webview-dic-a-2').css('display', 'block')
              } else if (url.indexOf('latin-dictionary.net') != -1) {
                $('.wb-dic-3').css('display', 'none')
                $('#webview-dic-a-3').css('display', 'block')
              } else if (url.indexOf('www.perseus.tufts.edu') != -1) {
                $('.wb-dic-4').css('display', 'none')
                $('#webview-dic-a-4').css('display', 'block')
              } else if (url.indexOf('www.lexilogos.com') != -1) {
                $('.wb-dic-5').css('display', 'none')
                $('#webview-dic-a-5').css('display', 'block')
              } else if (url.indexOf('www.dizionario-latino.com') != -1) {
                $('.wb-dic-6').css('display', 'none')
                $('#webview-dic-a-6').css('display', 'block')
              } else if (url.indexOf('archives.nd.edu') != -1) {
                $('.wb-dic-7').css('display', 'none')
                $('#webview-dic-a-7').css('display', 'block')
              } else if (url.indexOf('ducange.enc.sorbonne.fr') != -1) {
                $('.wb-dic-8').css('display', 'none')
                $('#webview-dic-a-8').css('display', 'block')
              } else if (url.indexOf('la.wikipedia.org') != -1) {
                $('.wb-dic-9').css('display', 'none')
                $('#webview-dic-a-9').css('display', 'block')
              } else if (url.indexOf('www.google.com') != -1) {
                $('.wb-dic-10').css('display', 'none')
                $('#webview-dic-a-10').css('display', 'block')
              } else if (url.indexOf('www.mobot.org') != -1) {
                $('.wb-dic-11').css('display', 'none')
                $('#webview-dic-a-11').css('display', 'block')
              } else if (url.indexOf('latin.packhum.org') != -1) {
                $('.wb-dic-12').css('display', 'none')
                $('#webview-dic-a-12').css('display', 'block')
              } else if (url.indexOf('www.drbo.org') != -1) {
                $('.wb-dic-13').css('display', 'none')
                $('#webview-dic-a-13').css('display', 'block')
              } else if (url.indexOf('www.latin-is-simple.com') != -1) {
                $('.wb-dic-14').css('display', 'none')
                $('#webview-dic-a-14').css('display', 'block')
              } else if (url.indexOf('www.verbix.com') != -1) {
                $('.wb-dic-15').css('display', 'none')
                $('#webview-dic-a-15').css('display', 'block')
              }
            }
          }
        }
  })

  intervalURLLoadedCheck = setInterval(()=>{
    ipcRenderer.send('webview-finished-check', 'Luz do meu ser')
  }, 100)
})

/**
 * Reseta visualizações dos WebView's.
 */
function ResetWebViewsFull ()
{
  loadedURLControlList = []
  ResetWebViews()

  // Reseta controle de checagem de finalização do carregamento das URL's dos WebView.
  ipcRenderer.send('webview-finished-reset', 'Deus é Lindo')
}

function ResetWebViews ()
{
  $('.internal-content-webview-loading').html(`
    <div class='internal-content-webview-loading-container' >
      <div class='internal-content-webview-loading-inner' >
        <img src='img/loading.gif' style='width:100%;max-width:200px;' /><br>
        Carregando...
      </div>
    </div>
  `)

  $('.wb-glosbe').css('display', 'block')
  $('.wb-dic-a').css('display', 'block')
  $('.wb-dic-b').css('display', 'block')
  $('.wb-dic-1').css('display', 'block')
  $('.wb-dic-2').css('display', 'block')
  $('.wb-dic-3').css('display', 'block')
  $('.wb-dic-4').css('display', 'block')
  $('.wb-dic-5').css('display', 'block')
  $('.wb-dic-6').css('display', 'block')
  $('.wb-dic-7').css('display', 'block')
  $('.wb-dic-8').css('display', 'block')
  $('.wb-dic-9').css('display', 'block')
  $('.wb-dic-10').css('display', 'block')
  $('.wb-dic-11').css('display', 'block')
  $('.wb-dic-12').css('display', 'block')
  $('.wb-dic-13').css('display', 'block')
  $('.wb-dic-14').css('display', 'block')
  $('.wb-dic-15').css('display', 'block')
  
  $('#webview-glosbe').css('display', 'none')
  $('#webview-online-latin-dictionary').css('display', 'none')
  $('#webview-online-latin-flexion').css('display', 'none')
  $('#webview-dic-a-1').css('display', 'none')
  $('#webview-dic-a-2').css('display', 'none')
  $('#webview-dic-a-3').css('display', 'none')
  $('#webview-dic-a-4').css('display', 'none')
  $('#webview-dic-a-5').css('display', 'none')
  $('#webview-dic-a-6').css('display', 'none')
  $('#webview-dic-a-7').css('display', 'none')
  $('#webview-dic-a-8').css('display', 'none')
  $('#webview-dic-a-9').css('display', 'none')
  $('#webview-dic-a-10').css('display', 'none')
  $('#webview-dic-a-11').css('display', 'none')
  $('#webview-dic-a-12').css('display', 'none')
  $('#webview-dic-a-13').css('display', 'none')
  $('#webview-dic-a-14').css('display', 'none')
  $('#webview-dic-a-15').css('display', 'none')
}

function FtmWord (word)
{
  word = word.toLowerCase()
  var wordNew = ''

  var alph = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'æ'
  ]

  for (var a=0; a<word.length; a++)
  {
    var found = false

    for (var b=0; b<alph.length; b++) {
      if (alph[b] == word[a]) {
        found = true
        break
      }
    }

    if (found == true)
    {
      wordNew += ''+ word[a]
    }
  }

  return wordNew
}

/**
 * Processa clique na palavra do texto original.
 */
function ProcessUniqueWord (id, word, mode = false, spec = false)
{
  var divHeight = '100%'
  
  // Formata palavra.
  word = FtmWord(word)

  // Reseta WebViews.
  ResetWebViewsFull()

  // Desmarca todos os marcados - texto original.
  $('.results-original-text-item').removeClass('results-original-text-item-marked')
  
  // Desmarca todos os marcados - livro.
  $('.results-original-text-book-item').removeClass('results-original-text-item-marked')
  
  // Marca palavra na área do texto original.
  if (mode == false) {
    $('#word-results-id-'+ id).addClass('results-original-text-item-marked')
  }

  // Marca palavra na área do livro.
  else 
  {
    // Clique vindo da área dos livros.
    if (spec == false)
    {
      // Exibe área dos resultados internos.
      ShowResultsArea1()

      $('#word-results-book-id-'+ id).addClass('results-original-text-item-marked')

      // *** Processa também busca usando os tradutores.
      currentTextToProcessTranslate = word
      ProcessRunBlocked = false
      GetRandLogosText()

      /**
       * Realiza processamento dos click's no texto original.
       */
      
      // Adiciona na área do texto original para permitir a possibilidade de também clicar na palavra.
      $('#results-original-text').html(
        '<span class="results-original-text-item" id="word-results-unique-specbook" '+
          ' onclick="javascript:ProcessUniqueWord(\'0\', \''+ word +'\', true, true);">'+ 
            word +'</span> ')

      $('#word-results-unique-specbook').addClass('results-original-text-item-marked')

      // Adiciona palavra no campo da busca.
      $('#field-start-text-results').val(word)

      /**
       * Realiza tradução simplificada.
       */
      ProcessStartTranslation()

      /**
       * Realiza processo de tradução complexa.
       */
      ProcessComplexTranslation()
    }

    // Clique vindo da área de texto original, mas que foi previamente adiconado
    // pelo clique na área dos livros.
    else {
      $('#word-results-unique-specbook').addClass('results-original-text-item-marked')
    }
  }
  
  // Abre glosbe.
  $('#webview-glosbe').html(
    '<webview src="https://glosbe.com/la/pt/'+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-glosbe.js" ></webview>')
  
  // Abre dicionário latim.
  $('#webview-online-latin-dictionary').html(
    '<webview src="https://www.online-latin-dictionary.com/latin-english-dictionary.php?parola='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-latin-dictionary-1.js" ></webview>')
    
  // Abre flexion.
  $('#webview-online-latin-flexion').html(
    '<webview src="https://www.online-latin-dictionary.com/latin-english-dictionary.php?parola='+ word +'&nosend-flag=1" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-latin-flexion-1.js" ></webview>')

  // Dic's...
  $('#webview-dic-a-1').html(
    '<webview src="http://alatius.com/ls/index.php?met=up&ord='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-2').html(
    '<webview src="https://la.wiktionary.org/wiki/'+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-3').html(
    '<webview src="https://latin-dictionary.net/search/latin/'+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-4').html(
    '<webview src="http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup='+ word +'&lang=la" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-5').html(
    '<webview src="https://www.lexilogos.com/latin/gaffiot.php?q='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-6').html(
    '<webview src="https://www.dizionario-latino.com/dizionario-latino-flessione.php?parola='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-7').html(
    '<webview src="http://archives.nd.edu/cgi-bin/wordz.pl?keyword='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-8').html(
    '<webview src="http://ducange.enc.sorbonne.fr/'+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-9').html(
    '<webview src="https://la.wikipedia.org/wiki/'+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-10').html(
    '<webview src="https://www.google.com/search?tbs=bks:1,bkv:p&tbo=p&q='+ word +'&num=100&as_qdr=all&hl=la" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-11').html(
    '<webview src="http://www.mobot.org/mobot/LatinDict/search_text.aspx?s='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-12').html(
    '<webview src="https://latin.packhum.org/search?q='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-13').html(
    '<webview src="http://www.drbo.org/cgi-bin/s?q='+ word +'&b=lvb&t=0" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-14').html(
    '<webview src="https://www.latin-is-simple.com/en/vocabulary/search/?q='+ word +'&ref=homeform" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

  $('#webview-dic-a-15').html(
    '<webview src="https://www.verbix.com/webverbix/go.php?&D1=9&T1='+ word +'" nodeintegration '+
    ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
    ' style="width:100%; height:'+ divHeight +'" preload="./renderer-dic-general-process.js" ></webview>')

}

/**
 * Oculta áreas.
 */
function HideAreas () 
{
  $('.area-div').css('display', 'none')
}

/**
 * Exibe área de acordo com a classe.
 */
function ShowAreaByClass (className)
{
  $('.'+ className).css('display', 'block')
}

/**
 * Realiza uma tradução mais complexa, buscando as palavras individualmente em dicionarios
 * e montando uma tabela com várias traduções das palavras do inglês para o português, de 
 * modo a facilitar o discernimento do contexto das frases.
 * Bem como insere junto com as traduções informações sobre declinações, gêneros, etc.
 */

/**
 * Variáveis de controle.
 */
var currentWordsCT = []
var currentWordsCTIndex = 0
var ComplexTranslationWorking = false
var ComplexTranslationInterval = null
var ComplexTranslationIntervalClientWS = null

function ProcessComplexTranslation ()
{
  var text = currentTextToProcessTranslate

  /**
   * Quebra em palavras.
   */

  // Reseta variáveis de controle.
  currentWordsCT = []
  currentWordsCTIndex = 0
  ComplexTranslationWorking = false

  $('#results-translate-unique-general').html('')
  $('#results-translate-unique-status').html('Traduzindo... Captando informações dos termos...')

  if (ComplexTranslationInterval != null && ComplexTranslationInterval != undefined)
    clearInterval(ComplexTranslationInterval)

  // Contêm apenas uma palavra.
  if (text.indexOf(' ') == -1) 
  {
    currentWordsCT.push({
      word: text.toString().trim(),
      information: null
    })
  }

  // Contêm várias palavras.
  else {
    var parts = text.split(' ')
    for (var a=0; a<parts.length; a++) {
      if (parts[a].toString().trim().length > 0) 
      {
        // Verifica se palavra já foi adicionada no array de controle.
        var found = false

        for (var b=0; b<currentWordsCT.length; b++) {
          if (currentWordsCT[b].word == parts[a].toString().trim().toLowerCase()) {
            found = true
            break
          }
        }

        if (found == false) {
          currentWordsCT.push({
            word: parts[a].toString().trim().toLowerCase(),
            information: null
          })
        }
      }
    }
  }

  if (currentWordsCT.length <= 0) {
    alert('Erro ao realizar tradução.')
    return false
  }

  $('#results-translate-unique-status').html('Traduzindo... '+ currentWordsCT.length +' termos únicos...')

  /**
   * Puxa definições das palavras em: https://www.online-latin-dictionary.com/latin-english-dictionary.php
   */
  ComplexTranslationInterval = setInterval(()=>{

    // Cancela operação.
    if (ProcessRunBlocked == true)
      clearInterval(ComplexTranslationInterval)

    if (ComplexTranslationWorking == false)
    {
      ComplexTranslationWorking = true

      // Adina existe palavras para processar.
      if (currentWordsCTIndex < currentWordsCT.length)
      {
        $('#results-translate-unique-status').html('Traduzindo... Processando termo '+ (currentWordsCTIndex + 1) +' de '+ currentWordsCT.length +'...')

        var plainWord = currentWordsCT[ currentWordsCTIndex ].word.toString().toLowerCase()
        var word = encodeURI(plainWord)
        var url = 'https://www.online-latin-dictionary.com/latin-english-dictionary.php?parola='+ word

        $('.bg-process-complex-div').html(
          '<webview src="'+ url +'" nodeintegration '+
          ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
          ' style="width:640px; height:480px" preload="./renderer-complex-dic-1.js" ></webview>')
      
        if (ComplexTranslationIntervalClientWS != null && ComplexTranslationIntervalClientWS != undefined)
          clearInterval(ComplexTranslationIntervalClientWS)
        ComplexTranslationIntervalClientWS = setInterval(()=>{
          ipcRenderer.send('grab-information-word-1-check', 'check')
        }, 100)
      }

      /**
       * Não existe mais palavras para traduzir.
       * Portanto processa exibição das informações.
       */
      else 
      {
        /**
         * Processa de levantamento das informações concluído.
         * Inicia processo de tradução das informações captadas.
         */
        ProcessComplexTranslationTraduction()

        // Fecha internal.
        clearInterval(ComplexTranslationInterval)
      }
    }
  }, 100)
}

/**
 * Controle da resposta do IPC.
 */
$(document).ready(()=>{
  
  // Tradução de palavra por palavra.
  ipcRenderer.on('grab-information-word-1-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.toString().trim().length > 0)
        {
          /**
           * Tradução da palavra finalizada, sinaliza para ir para a próxima da lista.
           */
          currentWordsCT[ currentWordsCTIndex ].information = {
            latimDic1_raw: arg
          }

          // Incrementa contagem das palavras.
          currentWordsCTIndex++

          // Especifica que já concluiu a tarefa, para realizar a tarefa seguinte.
          ComplexTranslationWorking = false
          
          // Finaliza checagem do IPC...
          clearInterval(ComplexTranslationIntervalClientWS)
        }
  })
})

/**
 * Controle geral da tradução dos resultados captados dos termos.
 */
var ComplexTranslationStep = 0
var ComplexTranslationStepInterval = null

function ProcessComplexTranslationTraduction ()
{
  // Resets.
  ComplexTranslationStep = 0

  if (ComplexTranslationStepInterval != null && ComplexTranslationStepInterval != undefined)
    clearInterval(ComplexTranslationStepInterval)

  // Controle.
  ComplexTranslationStepInterval = setInterval(()=>{
    
    // Cancela operação.
    if (ProcessRunBlocked == true)
      clearInterval(ComplexTranslationStepInterval)

    // Processa listas dos itens.
    if (ComplexTranslationStep == 0) {
      ComplexTranslationStep = 1
      ProcessComplexTranslationTraductionLists()
    }

    // Processa campo da gramática.
    else if (ComplexTranslationStep == 2) {
      ComplexTranslationStep = 1
      ProcessComplexTranslationTraductionGrammarField()
    }
  }, 100)
}

/**
 * Controle da tradução das listas das informações captadas.
 */
var ComplexTranslationPartsWorkerOn = false
var ComplexTranslationPartsInterval = null
var ComplexTranslationPartsIndex = 0

function ProcessComplexTranslationTraductionLists ()
{
  // Reseta informações de controle de execução.
  ComplexTranslationPartsWorkerOn = false
  ComplexTranslationPartsIndex = 0

  if (ComplexTranslationPartsInterval != null && ComplexTranslationPartsInterval != undefined)
    clearInterval(ComplexTranslationPartsInterval)

  // Controle de execução.
  ComplexTranslationPartsInterval = setInterval(()=>{
    
    // Cancela operação.
    if (ProcessRunBlocked == true)
      clearInterval(ComplexTranslationStepInterval)

    // Processamento.
    if (ComplexTranslationPartsWorkerOn == false) {
      ComplexTranslationPartsWorkerOn = true
      
      // Ainda existe itens para processamento.
      if (ComplexTranslationPartsIndex < currentWordsCT.length) 
      {
        // Palavra traduzida com sucesso.
        if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.status == 'success')
        {
          var found = false
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.translations)
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.translations.length)
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.translations.length > 0)
            found = true

          // Não foi encontrada nenhuma traduçao - passa pra próxima da fila.
          if (found == false) {
            ComplexTranslationPartsIndex++
            ComplexTranslationPartsWorkerOn = false
          }

          // Tradução realizada com sucesso.
          else
          {
            /**
             * Processa lista de traduções da palavra.
             */
            ProcessComplexTranslationWordList(ComplexTranslationPartsIndex)
          }
        }

        // Erro na tradução da palavra - passa pra próxima da fila.
        else 
        {
          ComplexTranslationPartsIndex++
          ComplexTranslationPartsWorkerOn = false
        }
      }

      // Finalizou o processamento dos itens a serem traduzidos.
      else
      {
        ComplexTranslationStep = 2
        clearInterval(ComplexTranslationPartsInterval)
      }
    }
  }, 100)
}

/**
 * Processa lista de definições da palavra a ser traduzida.
 */
var ComplexTranslationListWorker = null
var ComplexTranslationListWorkerOn = false
var ComplexTranslationListWorkerIndex = 0
var ComplexTranslationListWorkerIndexItem = 0
var ComplexTranslationListWorkerUnique = null

function ProcessComplexTranslationWordList (listIndex)
{
  // Configurações/resets.
  ComplexTranslationListWorkerOn = false
  ComplexTranslationListWorkerIndex = listIndex
  ComplexTranslationListWorkerIndexItem = 0

  if (ComplexTranslationListWorker != null && ComplexTranslationListWorker != undefined)
    clearInterval(ComplexTranslationListWorker)

  // Execução.
  ComplexTranslationListWorker = setInterval(()=>{
    
    // Cancela operação.
    if (ProcessRunBlocked == true)
      clearInterval(ComplexTranslationListWorker)

    // Processamento.
    if (ComplexTranslationListWorkerOn == false) {
      ComplexTranslationListWorkerOn = true

      // Ainda possui itens para processar.
      if (ComplexTranslationListWorkerIndexItem < 
          currentWordsCT[ ComplexTranslationListWorkerIndex ].information.latimDic1_raw.translations.length)
      {
        $('#results-translate-unique-status').html(
          'Traduzindo item '+ ComplexTranslationListWorkerIndex +' / '+ currentWordsCT.length +
            '  de '+ (ComplexTranslationListWorkerIndexItem + 1) +' / '+ 
              currentWordsCT[ ComplexTranslationListWorkerIndex ].information.latimDic1_raw.translations.length +'...')

        var text = currentWordsCT[ ComplexTranslationListWorkerIndex ].information.latimDic1_raw.translations[ ComplexTranslationListWorkerIndexItem ].en
        var url = 'https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text='+ encodeURI(text)
        
        $('.bg-process-complex-div-google').html(
          '<webview src="'+ url +'" nodeintegration '+
          ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
          ' style="width:640px; height:480px" preload="./renderer-complex-google-dic1.js" ></webview>')

        if (ComplexTranslationListWorkerUnique != null && ComplexTranslationListWorkerUnique != undefined)
          clearInterval(ComplexTranslationListWorkerUnique)
        ComplexTranslationListWorkerUnique = setInterval(()=>{
          ipcRenderer.send('grab-information-word-2-check', 'check')
        }, 100)
      }

      // Fim do processamento dos itens.
      else
      {
        console.log('Processamento da lista finalizado.')

        // Sinaliza para o controle em grau superior para continuar com o processamento dos itens.
        ComplexTranslationPartsIndex++
        ComplexTranslationPartsWorkerOn = false

        // Fecha interval do processamento da lista.
        clearInterval(ComplexTranslationListWorker)
      }
    }
  }, 100)
}

/**
 * Controle do IPC da tradução do Google na área do Complex Translate.
 */
$(document).ready(()=>{
  
  ipcRenderer.on('grab-information-word-2-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.toString().trim().length > 0)
        {
          console.log('Translated: '+ arg)

          // Salva item traduzido em seu respectivo nó.
          currentWordsCT[ ComplexTranslationListWorkerIndex 
            ].information.latimDic1_raw.translations[ ComplexTranslationListWorkerIndexItem ].pt = arg
        
          // Sinaliza para continuar com o processamento da lista.
          ComplexTranslationListWorkerIndexItem++
          ComplexTranslationListWorkerOn = false

          // Atualiza informações em tempo real.
          ProcessComplexFormatData()
        }
  })
})

/**
 * Processa campo da gramática no resultado dos termos.
 */

function ProcessComplexTranslationTraductionGrammarField ()
{
  // Reseta informações de controle de execução.
  ComplexTranslationPartsWorkerOn = false
  ComplexTranslationPartsIndex = 0

  if (ComplexTranslationPartsInterval != null && ComplexTranslationPartsInterval != undefined)
    clearInterval(ComplexTranslationPartsInterval)

  // Controle de execução.
  ComplexTranslationPartsInterval = setInterval(()=>{
    
    // Cancela operação.
    if (ProcessRunBlocked == true)
      clearInterval(ComplexTranslationPartsInterval)

    // Processamento.
    if (ComplexTranslationPartsWorkerOn == false) {
      ComplexTranslationPartsWorkerOn = true
      
      // Ainda existe itens para processamento.
      if (ComplexTranslationPartsIndex < currentWordsCT.length) 
      {
        // Palavra traduzida com sucesso.
        if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.status == 'success')
        {
          var found = false
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.grammatica)
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.grammatica.toString().trim().length)
          if (currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.grammatica.toString().trim().length > 0)
            found = true

          // Não foi encontrada nenhuma traduçao - passa pra próxima da fila.
          if (found == false) {
            ComplexTranslationPartsIndex++
            ComplexTranslationPartsWorkerOn = false
          }

          // Tradução realizada com sucesso.
          else
          {
            $('#results-translate-unique-status').html(
              'Traduzindo... Finalizando '+ (ComplexTranslationPartsIndex+1) +' de '+ currentWordsCT.length +'...')

            /**
             * Processa campo da gramática.
             */
            var text = currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.grammatica.toString().trim()
            var url = 'https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text='+ encodeURI(text)
            
            $('.bg-process-complex-div-google').html(
              '<webview src="'+ url +'" nodeintegration '+
              ' useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36" '+
              ' style="width:640px; height:480px" preload="./renderer-complex-google-dic2.js" ></webview>')

            if (ComplexTranslationListWorkerUnique != null && ComplexTranslationListWorkerUnique != undefined)
              clearInterval(ComplexTranslationListWorkerUnique)
            ComplexTranslationListWorkerUnique = setInterval(()=>{
              ipcRenderer.send('grab-information-word-3-check', 'check')
            }, 100)
          }
        }

        // Erro na tradução da palavra - passa pra próxima da fila.
        else 
        {
          ComplexTranslationPartsIndex++
          ComplexTranslationPartsWorkerOn = false
        }
      }

      // Finalizou o processamento dos itens a serem traduzidos.
      else
      {
        $('#results-translate-unique-status').html('')
        ProcessComplexFormatData(true)
        clearInterval(ComplexTranslationStepInterval)
        clearInterval(ComplexTranslationPartsInterval)
      }
    }
  }, 100)
}

/**
 * Controle do IPC da tradução da gramática.
 */
$(document).ready(()=>{
  ipcRenderer.on('grab-information-word-3-check-reply', (event, arg) => {
    if (arg)
      if (arg != null)
        if (arg.toString().trim().length > 0)
        {
          console.log('Translated: '+ arg)

          // Salva item traduzido em seu respectivo nó.
          currentWordsCT[ ComplexTranslationPartsIndex ].information.latimDic1_raw.grammaticaPt = arg
        
          // Sinaliza para continuar com o processamento dos itens.
          ComplexTranslationPartsIndex++
          ComplexTranslationPartsWorkerOn = false

          // Atualiza informações em tempo real.
          ProcessComplexFormatData()
        }
  })
})

/**
 * Formata dados de exibição da tradução complexa.
 */
function ProcessComplexFormatData (endstep = false)
{
  var html = 
    `<div class="results-table-div-2" >
      <table width="100%" cellspacing="0" cellpadding="0" border="0" >`
  var bgColor = '#dddddd'

  for (var a=0; a<currentWordsCT.length; a++)
  {
    var word = currentWordsCT[ a ].word
    var defination = currentWordsCT[ a ].information.latimDic1_raw.defination
    var grammar = currentWordsCT[ a ].information.latimDic1_raw.grammaticaPt;

    if (!defination || defination == null || defination == undefined)
      defination = ''
    if (!grammar || grammar == null || grammar == undefined)
      grammar = ''

    html += "<tr style='background-color:"+ bgColor +";' >"
    html += "<td class='results-translate-unique-table' valign='top' ><b>"+ word +'</b> <br>'+ defination +"</td>"
    
    var fullContent = '<b><i>Gramática:</i> <u>'+ grammar +'</u></b><br>'
    if (grammar.length <= 0) {
      if (endstep == true)
        fullContent = '<b><i>Tradução não encontrada.</i></b><br>'
      else
        fullContent = '<b><i>Procurando gramática...</i></b><br>'
    }

    if (currentWordsCT[a].information.latimDic1_raw.translations)
    if (currentWordsCT[a].information.latimDic1_raw.translations.length)
    if (currentWordsCT[a].information.latimDic1_raw.translations.length > 0)

    for (var b=0; b<currentWordsCT[a].information.latimDic1_raw.translations.length; b++)
    {
      var item = currentWordsCT[ a ].information.latimDic1_raw.translations[ b ].pt
      if (item.toString().trim().length > 0)
      {
        fullContent += item +"</br>"
      }
    }

    html += "<td class='results-translate-unique-table' valign='top' >"+ fullContent +"</td>"
    html += "</tr>"

    if (bgColor == '#dddddd')
      bgColor = ''
    else
      bgColor = '#dddddd'
  }

  html += "</table></div>"
  $('#results-translate-unique-general').html(html)
}

/**
 * Controle do modal dos materiais.
 */
var booksLoaded = []

$(document).ready(()=>{
  booksLoaded = []

  // Abertura do moal.
  $('#btn-results-tbl1').on('click', ()=>{
    ShowMaterialModal()
  })

  // Botão para voltar na área principal.
  $('#btn-material-back').on('click', ()=>{
    MaterialBackButton()
  })

  // Opção das tabelas gramaticais.
  $('#material-option-tables').on('click', ()=>{
    HideAllMaterialModalAreas()
    ShowMaterialAreaById('material-tables')
    ShowMaterialBackBtn()

    $('#material-tables-img-content').css('display', 'flex')
    $('#material-tables-img-view').css('display', 'none')
  })

  // Opção dos livros em latim.
  $('#material-option-books').on('click', ()=>{
    HideAllMaterialModalAreas()
    ShowMaterialAreaById('material-books')
    ShowMaterialBackBtn()
  })

  // Opção para abertura dos videos em latim.
  $('#material-option-videos').on('click', ()=>{
    HideAllMaterialModalAreas()
    ShowMaterialAreaById('material-videos')
    ShowMaterialBackBtn()
  })

  /**
   * Carrega imagens da opção de tabelas.
   */
  $('#material-tables-img-content').html('')
  fs.readdir(path.join(__dirname, './material/tabelas/'), function(err, files) {
    for (var a=0; a<files.length; a++) {
      if (files[a].indexOf('png') != -1 || files[a].indexOf("jpg") != -1)
      {
        var imageName = files[a]
        var imageNameTitle = imageName.split('.')
        imageNameTitle = imageNameTitle[0].toString().trim()
        
        if (imageNameTitle.length <= 0)
          imageNameTitle = 'Imagem'
        
        $('#material-tables-img-content').append(`
          <div class='col-md-4 material-tables-item' onclick='javascript:MaterialOpenImageView("`+ imageNameTitle +`", "`+ imageName +`");' >
            `+ imageNameTitle +`<br>
            <img src='material/tabelas/`+ imageName +`' class='material-tables-img-listing' />          
          </div>
        `)
      }
    }
  })

  // Reseta configurações da área de visualização das tabelas gramaticais.
  $('#material-tables-img-content').css('display', 'flex')
  $('#material-tables-img-view').css('display', 'none')
  
  /**
   * Realiza carregamento dos livros.
   */
  var booksWorker = new Worker("js/books-read-worker.js");

  booksWorker.onmessage = function(event) {
    console.log('books loaded!')
    var books = event.data, bookList = ''

    // Copia array...
    for (var a=0; a<books.length; a++)
    {
      booksLoaded.push(books[a])
    }

    for (var a=0; a<booksLoaded.length; a++)
    {
      bookList += `
        <div class='col-md-12 material-book-item-listing-title' >
          <i class='fa fa-arrow-right'></i> `+ booksLoaded[a].name +`
        </div>
      `

      for (var b=0; b<booksLoaded[a].books.length; b++)
      {
        bookList += `
          <div class='col-md-12 material-book-item-listing' onclick='javascript:OpenBookView(`+ a +`, `+ b +`);' >
            <i class='fa fa-book'></i> `+ booksLoaded[a].books[b].book +`
          </div>
          `
      }
    }

    $('#material-book-listing-names').html(bookList)
  };
})

// Abre imagem para exibição.
function MaterialOpenImageView (title, path)
{
  $('#material-tables-img-content').css('display', 'none')
  $('#material-tables-img-view').css('display', 'flex')
  materialBackButtonStep = 1

  $('#material-tables-img-view').html(`
    <div class='col-md-12' >
      <center>
        <div class='material-tables-img-view-title' >`+ title +`</div>
        <img src='material/tabelas/`+ path +`' class='material-tables-img-view' />          
      </center>
    </div>
  `)
}

// Controle do botão de voltar.
var materialBackButtonStep = 0

function MaterialBackButton ()
{
  // Retorna do visualizador de imagens, para a listagem das tabelas.
  if (materialBackButtonStep == 1) 
  {
    materialBackButtonStep = 0
    $('#material-tables-img-content').css('display', 'flex')
    $('#material-tables-img-view').css('display', 'none')
  }

  // Retorno padrão para área principal.
  else {
    HideAllMaterialModalAreas()
    ShowMaterialAreaById('material-start')
    HideMaterialBackBtn()
  }
}

// Exibe modal.
function ShowMaterialModal ()
{
  $('#modal-results-tbl1').modal('show')
}

// Oculta todas as áreas do modal.
function HideAllMaterialModalAreas ()
{
  var areas = [
    'material-start',
    'material-tables',
    'material-books',
    'material-videos'
  ]

  for (var a=0; a<areas.length; a++)
    $('#'+ areas[a]).css('display', 'none')
}

// Exibe área do modal de acordo com o ID.
function ShowMaterialAreaById (id)
{
  $('#'+ id).css('display', 'flex')
}

// Oculta botão de voltar.
function HideMaterialBackBtn ()
{
  $('#material-back-btn-area').css('display', 'none')
}

// Exibe botão de voltar.
function ShowMaterialBackBtn ()
{
  $('#material-back-btn-area').css('display', 'flex')
}

/**
 * Controle de visualização dos livros.
 */
var currentBookIndexOpen1 = 0
var currentBookIndexOpen2 = 0
var currentBookIndexPage = 1
var currentBookTotalPages = 0
var currentBookName = ''

function OpenBookView (index1, index2)
{
  if (!booksLoaded[index1])
    return false;
  if (!booksLoaded[index1].books)
    return false;
  if (!booksLoaded[index1].books[index2])
    return false;

  currentBookIndexOpen1 = index1
  currentBookIndexOpen2 = index2
  currentBookIndexPage = 1
  currentBookTotalPages = booksLoaded[currentBookIndexOpen1].books[currentBookIndexOpen2].pages.length
  currentBookName = booksLoaded[currentBookIndexOpen1].books[currentBookIndexOpen2].book

  LoadBookViewData()
}

// Controle de paginação do leitor de livros.
function BookViewLeftPage ()
{
  currentBookIndexPage--
  if (currentBookIndexPage < 1)
    currentBookIndexPage = 1
  LoadBookViewData()
}

function BookViewRightPage ()
{
  currentBookIndexPage++
  if (currentBookIndexPage > currentBookTotalPages)
    currentBookIndexPage = currentBookTotalPages
  LoadBookViewData()
}

/**
 * Controle da paginação. 
 */
function BookViewPaginationFocus (e)
{
  $('.box-selection-translation').css('display', 'none')
  clearSelection()
  SelectionEnabled = false
}

function BookViewPaginationPress (e, el)
{
  if (e.key == "Enter")
  {
    currentBookIndexPage = el.value
    
    if (currentBookIndexPage < 1)
      currentBookIndexPage = 1
    
    if (currentBookIndexPage > currentBookTotalPages)
      currentBookIndexPage = currentBookTotalPages
    
    LoadBookViewData()
  }
}

// Carrega conteúdo da visualização do livro.
function LoadBookViewData ()
{
  // Exibe área de leitura do livro.
  $('#results-parts-area-1').removeClass('col-md-12')
  $('#results-parts-area-1').addClass('col-md-6')

  $('#results-parts-area-2').css('display', 'block')
  $('#modal-results-tbl1').modal('hide')

  // Lê conteúdo da página em questão.
  if ((currentBookIndexPage-1) < 0)
    currentBookIndexPage = 1
  
  fs.readFile(booksLoaded[currentBookIndexOpen1].books[currentBookIndexOpen2].pages[currentBookIndexPage-1].path, 'utf-8', (err, data) => {
    if (err)
      return;
    
    //console.log(data)
    
    // Formata.
    var text = data

    // Organiza.
    text = text.replace(/\r/g, ' ');
    text = text.replace(/\t/g, ' ');
    text = text.replace(/\v/g, ' ');

    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\|#/g, '<br><br>|#');

    var partsRaw = text.split(' '), parts = []

    for (var a=0; a<partsRaw.length; a++) {
      if (partsRaw[a].toString().trim().length > 0) {
        parts.push( partsRaw[a].toString().trim() )
      }
    }

    // Formata HTML.
    var htmlContent = ''

    for (var a=0; a<parts.length; a++)
    {
      if (parts[a].toString().indexOf('<br>') == -1)
      {
        htmlContent += 
          '<span class="results-original-text-book-item" id="word-results-book-id-'+ a +
            '" onclick="javascript:ProcessUniqueWord(\''+ a +'\', \''+ parts[a] +'\', true);">'+ 
              parts[a] +'</span> '
      }

      else 
      {
        htmlContent += parts[a] +' '
      }
    }

    // Exibição dos dados.
    $('#results-parts-area-2').html(`

      <div style='display:block;width:100%;height:30px;max-height:30px;' >
        <table width='100%' cellspacing='0' cellpadding='0' border='0' >
        <tr>
        <td valign='top' >
          
          <table width='100%' cellspacing='0' cellpadding='0' border='0' >
          <tr>
          <td>
            <button onclick="javascript:BookViewLeftPage();" class="btn btn-success" style='display:inline-block;' >
              <i class='fa fa-arrow-left' ></i></button>
          </td>
          <td>        
            <button onclick="javascript:BookViewRightPage();" class="btn btn-success" style='display:inline-block;' >
              <i class='fa fa-arrow-right' ></i></button>
          </td>
          </td>
          </table>

        </td>
        <td>
        &nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td valign='top' style='font-size: 12px;' >

        Página:&nbsp;<span class='book-view-page-number'>
          <input 
            id='boot-view-pagination-press'
            onfocus='javascript:BookViewPaginationFocus(this);'
            onkeyup='javascript:BookViewPaginationPress(event,this);'
            
            style='
              display:inline-block;
              border: 1px dashed black;
              width: 40px;
              outline: none;
          ' type='text' value='`+ currentBookIndexPage +`' />&nbsp;/&nbsp;`+ currentBookTotalPages +`</span> 
        </td>
        <td>
        &nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td valign='top' >

          <div style='width:100%;height:30px;overflow:auto;font-size:13px;' >
            `+ currentBookName +`
          </div>

        </td>
        <td>
        &nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td valign='top' >
        <button onclick="javascript:BookViewClose();" class="btn btn-dark" style='display:inline-block;float:right;' >
          <i class='fa fa-times' ></i></button>
        </td>
        </tr>
        </table>
      </div>

      <div style='
        text-align: justify;
        display:block;
        width:100%;
        height:calc(100% - 110px);
        max-height:calc(100% - 110px);
        min-height:calc(100% - 110px);
        overflow:auto;
        padding:15px;' >

      `+ htmlContent +`

      </div>
    `)
  });
}

// Fecha visualização do livro.
function BookViewClose ()
{
  $('#results-parts-area-1').removeClass('col-md-6')
  $('#results-parts-area-1').addClass('col-md-12')
  $('#results-parts-area-2').css('display', 'none')
}

$(document).ready(()=>{
  
  // Foca no campo da busca.
  $('#field-start-text-results').focus()

  // Seleção na div do livro.
  document.getElementById('results-parts-area-2').onmouseup = TextSelectionBook;
  document.getElementById('results-parts-area-2').onkeyup = TextSelectionBook;
})

/**
 * Controle da seleção do texto na área do livro.
 */
var textTranslationFromSelection = ''

function TextSelectionBook () 
{
  var selectedText = getSelectedText();
  if (selectedText) 
  {
    textTranslationFromSelection = selectedText
    $('.box-selection-translation').css('display', 'block')
    SelectionEnabled = true
  }
}

// Controle do botão de tradução por seleção.
$(document).ready(()=>{
  $('.box-selection-translation').on('click', ()=>{
    $('.box-selection-translation').css('display', 'none')
    clearSelection()
    $('#field-start-text-results').val(textTranslationFromSelection)

    // Inicia tradução.
    StartProcessTranslateByResultsArea()
  })
  
  $(document).on('mousedown', function(event) { 
    if (SelectionEnabled == true)
    {
      SelectionEnabled = false
      $target = $(event.target);
      if(!$target.closest('.box-selection-translation').length && 
      $('.box-selection-translation').is(":visible")) {
        $('.box-selection-translation').hide();
      }
    }
  });
})

var SelectionEnabled = false

/**
 * Funções extras.
 */

// https://stackoverflow.com/questions/979662/how-to-detect-pressing-enter-on-keyboard-using-jquery
$.fn.enterKey = function (fnc) {
  return this.each(function () {
      $(this).keypress(function (ev) {
          var keycode = (ev.keyCode ? ev.keyCode : ev.which);
          if (keycode == '13') {
              fnc.call(this, ev);
          }
      })
  })
}

// https://stackoverflow.com/questions/4712310/javascript-how-to-detect-if-a-word-is-highlighted
function getSelectedText () 
{
  var text = "";
  if (typeof window.getSelection != "undefined") {
      text = window.getSelection().toString();
  } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      text = document.selection.createRange().text;
  }
  return text;
}

// https://stackoverflow.com/questions/6562727/is-there-a-function-to-deselect-all-text-using-javascript
function clearSelection()
{
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}
