
// *** Ações padrões.
$(document).ready(function(){
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nDicionário inicializado!');
  
  $('#text-content').focus();
});

// *** Inicialização.
var textToTranslate = null;

$(document).ready(function(){
  
  // Inicia processo.
  $('#btn-translate').on('click', function(){
    if (!($('#text-content').val().length > 0)) {
      alert('Digite o texto a ser traduzido!');
      $('#text-content').focus();
      return false;
    }
    
    textToTranslate = $('#text-content').val();
    HideDiv('#area1');
    HideDiv('#area2');
    ShowDiv('#area3');
    ShowDiv('#area4');
    
    TranslateContent(textToTranslate, function(data){
      $('#original').text(textToTranslate);
      $('#palavras').text(textToTranslate);
      $('#frase').text(data);
      
      // Controle tradução das palavras.
      $.fn.splitWords = function(ary) {
        this.html('<span>'+this.html().split(' ').join('</span> <span>')+'</span>');
        this.children('span').click(function(){
          $(this).css("background-color","gray");
          $(this).css("color","white");
          $(this).css("padding","3px");
          $(this).css("margin","5px");
          $(this).css("border-radius","3px");
          ary.push($(this).html());
          var word = $(this).text();
          $(this).text('...');
          TranslateWord($(this), word);
          
          /*
          var btnInformation = document.createElement('div');
          btnInformation.style.width = '3px';
          btnInformation.style.height = '3px';
          btnInformation.style.backgroundColor = 'red';
          */
          
          //var btnInformation = 'oi';
          //$(this).html($(this).html() + btnInformation);
        });
      };

      var words = [];
      $('#palavras').splitWords(words);
      
    });
  });
  
  // Voltar.
  $('#btn-voltar').on('click', function (){
    ShowDiv('#area1');
    ShowDiv('#area2');
    HideDiv('#area3');
    HideDiv('#area4');
  });
  
});

// *** Funções diversas.
var arrayWords = [];

var GlobalObj = null;
var GlobalWord = null;

function TranslateWord (obj, word) {
  GlobalObj = obj;
  GlobalWord = word;
  
  word = ProccessWord(word);
  
  TranslateContent(word, function(data){
    var wd = ReProccessWord(GlobalWord, data);
    GlobalObj.text(wd);
    InsertArrayWords(GlobalWord, wd);
    
    // Passa mouse na palavra.
    GlobalObj.mouseenter(function(event){
      
      // Cria janela com informações adicionais.
      var windowInformation = document.createElement('div');
      windowInformation.style.width = '500px';
      windowInformation.style.height = '500px';
      windowInformation.style.position = 'absolute';
      windowInformation.style.top = event.pageY +'px';
      windowInformation.style.left = event.pageX +'px';
      windowInformation.style.backgroundColor = 'white';
      windowInformation.style.borderRadius = '5px';
      windowInformation.style.boxShadow = '1px 1px 1px 1px black';
      windowInformation.innerHTML = "<br><br><center>"+
        "<img src='./img/loading.gif' style='width:100px;' /><br>"+
        "<font style='color:#006989;' >Carregando...</font></center>";
      $(windowInformation).mouseleave(function(event){
        $(this).hide();
      });
      $('body').append(windowInformation);
      
      // Carrega as informações.
      var wordFmt = GetArrayItem($(this).text());
      
      windowInformation.innerHTML = "<iframe src='https://glosbe.com/la/pt/"+ wordFmt +"' style='width:100%;height:100%;' ></iframe>";
      
      /*
      var cEl = $(this);
      
      $.ajax({
        url         : 'https://glosbe.com/la/pt/'+ wordFmt,
        dataType    : 'html',
        beforeSend  : function(XHR) {
          XHR.selfDom = windowInformation;
        },
        success     : function(data, code, jqXHR){
          //var $item = jqXHR.selfDom;
          //console.log('lol:', $item.text());
          //console.log(data);
          //$('body').append('<textarea>'+ data +'</textarea>');
          FormatInformationData(jqXHR.selfDom, data);
        } 
      });
      */
      
    });
    
    $("#last-word").text(GlobalWord);
    $("#last-word-to").text(wd);
  });
}

// Formata informações adicionais e exibe na janela.
function FormatInformationData (obj, data) {
  
  /*
  var dv = document.createElement('div');
  dv.innerHTML = data;
  var el = dv.getElementsByTagName('article');
  console.log(el[0]);
  
  //return;
  
  var a1 = el[0].innerHTML;
  
  //a1 = els6[0];
  
  if (0)
  if (data.indexOf('nojsvisible additional-data') != -1) {
    a1 = data.split('nojsvisible additional-data');
    a1 = a1[1].split('</table>');
    a1 = '<a> Show declension of <br><br>'+ a1[0].trim() +'</div></div>';
    a1 = a1.replace('display:none', '');
    a1 = '<span style="color:black;" >'+ a1 +'</span>';
    a1 = a1.replace('<table>', '<table style="color:black;" >');
  }
  
  if (0)
  if (data.indexOf('<article><div class="contentBox">') != -1) {
    a1 = data.split('<article><div class="contentBox">');
    a1 = a1[1].split('</div></article>');
    a1 = a1[0].trim();
  }
  
  console.log(a1);
  
  obj.innerHTML = a1;
  obj.style.padding = '10px';
  obj.style.width = 'auto';
  obj.style.height = 'auto';
  obj.style.position = 'absolute';
  obj.style.backgroundColor = 'white';
  obj.style.color = 'black';
  obj.style.borderRadius = '5px';
  obj.style.boxShadow = '1px 1px 1px 1px black';
  */
}

// Insere item no array de controle global.
function InsertArrayWords (key, value) {
  var exists = false;
  
  for (var a=0; a<arrayWords.length; a++) {
    if (arrayWords[a][0] == key && arrayWords[a][1] == value) {
      exists = true;
      break;
    }
  }
  
  if (exists == false) {
    arrayWords.push([
      key, value
    ]);
  }
}

// Retorna item do array.
function GetArrayItem (key) {
  for (var a=0; a<arrayWords.length; a++) {
    if (arrayWords[a][1] == key) {
      return arrayWords[a][0];
    }
  }
  return null;
}

// Processa palavra.
function ProccessWord (word) {
  word = word.replace('.', '');
  word = word.replace(',', '');
  word = word.replace(':', '');
  word = word.replace('=', '');
  return word;
}

// Reprocessa palavra.
function ReProccessWord (oldWord, newWord) {
  if (oldWord[oldWord.length-1] == '.') 
    newWord += '.';
  if (oldWord[oldWord.length-1] == ',') 
    newWord += ',';
  if (oldWord[oldWord.length-1] == ':') 
    newWord += ':';
  if (oldWord[oldWord.length-1] == '=') 
    newWord += '=';
  return newWord;
}

// Tradutor.
function TranslateContent (data, callback) {
  const net = require('net');
  if (net) {
    console.log('NET module loaded!');
    
    socketClient = require('net').connect({
      host: 'translate.google.com', port: 80
    }, () => {
      console.log('Connected to server.');
      var postData = 'sl=la&tl=pt&q='+ encodeURI(data);
      
      var header = 
        "POST /translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=es-ES&ie=UTF-8"+
        "&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e HTTP/1.1\r\n" +
        "Host: translate.google.com\r\n"+
        "User-Agent: AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1\r\n"+
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"+
        "Content-Length: "+ postData.length +"\r\n"+
        "Connection: close\r\n\r\n"+
        postData +"\r\n";
        
      socketClient.write(header);
      console.log('header sended!');
    });
    
    var responseFinal = "";
    socketClient.on('data', (data) => {
      responseFinal += data;
    });
    
    socketClient.on('end', () => {
      console.log('Disconnected from server.');
      
      var responseFmt = responseFinal.split("\r\n\r\n");
      //console.log(responseFmt[1].trim());
      
      responseObj = JSON.parse(responseFmt[1].trim());
      if (responseObj) {
        if (responseObj.sentences) {
          if (responseObj.sentences[0]) {
            if (responseObj.sentences[0].trans) {
              callback(responseObj.sentences[0].trans);
            }
          }
        }
      }
    });
  }
}

// Oculta div.
function HideDiv (el) {
  $(el).css('visibility', 'hidden');
  $(el).css('display', 'none');
}

// Exibe div.
function ShowDiv (el) {
  $(el).css('visibility', 'visible');
  $(el).css('display', 'block');
}























