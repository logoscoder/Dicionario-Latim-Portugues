
/**
 * Worker para leitura dos arquivos dos livros.
 */
var fs = require('fs'), path = require('path')

// https://gist.github.com/kalisjoshua/3718809
var tree = function(dir, done) {
  var results = {
      "path": dir
      ,"children": []
    };

  fs.readdir(dir, function(err, list) {
    if (err) { return done(err); }
    var pending = list.length;
    if (!pending) { return done(null, results); }
    list.forEach(function(file) {
      fs.stat(dir + '/' + file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          tree(dir + '/' + file, function(err, res) {
            results.children.push(res);
            if (!--pending){ done(null, results); }
          });
        } else {
          results.children.push({"path": dir + "/" + file});
          if (!--pending) { done(null, results); }
        }
      });
    });
  });
};

tree(path.join(__dirname, '../material/livros'), function (err, files) {
  //console.log(files)

  var personsBooks = []
  
  for (var a=0; a<files.children.length; a++)
  {
    // Separa nome do autor.
    var personName = ''
    for (var n=files.children[a].path.length; n>0; n--) {
      if (files.children[a].path[n] == '/' || files.children[a].path[n] == '\\') {
        personName = files.children[a].path.substring(n + 1, files.children[a].path.length)
        break
      }
    }

    //console.log('Autor: '+ personName)
    var booksLoaded = []

    // Separa nome dos livros.
    var bookName = ''
    for (var x=0; x<files.children[a].children.length; x++)
    {
      for (var y=files.children[a].children[x].path.length; y>0; y--) {
        if (files.children[a].children[x].path[y] == '/' || files.children[a].children[x].path[y] == '\\') {
          bookName = files.children[a].children[x].path.substring(y + 1, files.children[a].children[x].path.length)
          break
        }
      }

      //console.log('Livro: '+ bookName)

      // Separa páginas do livro.

      /**
       * Organiza arquivos.
       */
      var pages = []

      // Lista quantidade de páginas existentes.
      for (var b=1; b<=files.children[a].children[x].children.length; b++)
      {
        // Reestrutura com base no numero da página.
        for (var c=0; c<files.children[a].children[x].children.length; c++)
        {
          var pageIndex = files.children[a].children[x].children[c].path.split('page-')
          pageIndex = pageIndex[1].toString().split('.')
          pageIndex = pageIndex[0]
          
          if (parseInt(pageIndex) == b)
          {
            pages.push({
              page: b,
              path: files.children[a].children[x].children[c].path
            })
          }
        }
      }

      if (pages.length > 0)
      {
        booksLoaded.push({
          book: bookName,
          pages: pages
        })
      }
    }

    personsBooks.push({
      name: personName,
      books: booksLoaded
    })
  }

  // Livros lidos.
  if (personsBooks.length > 0)
  {
    postMessage(personsBooks)
  }
})

