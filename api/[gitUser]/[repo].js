// module.exports = getGit;

// // module.exports = (req, res) => {
// //   res.json({
// //     body: req.body,
// //     query: req.query,
// //     cookies: req.cookies,
// //   })
// // }

// // app.get(["/deckData/:deckName/", "/deckData/:deckName/*"], getGit);

// // Set up REST end point
// function getGit(req, res) {
//   console.log(`\n+++++++\n \
//     getGit`);
// }
module.exports = async (req, res) => {
  console.log(`\n+++++++\n \
    getGit`);
  // const { body } = req.body;
  // const query = req.query;
  // res.send(`Hello ${query.name}, ${req.method}, you just parsed the request body!`)

  const gitRootPath = '/Users/chadcrume/Git/';
  const { join } = require('path')
  const fs = require('fs');

  console.log(`\n+++++++\nadhocSetVars`);
  jsonOut = {};
  locals = {};
  locals.title = "Browse";
  locals.url = decodeURIComponent(req.url);
  locals.gitUser = decodeURIComponent(req.query.gitUser);
  locals.repo = decodeURIComponent(req.query.repo);
  locals.url = decodeURIComponent(req.url);
  locals.path = decodeURIComponent(req.url)
    .replace(new RegExp(`(/api|/ccc)?/${locals.gitUser}/${locals.repo}/?`, "g"), '')
    .replace(new RegExp(`\\?(.*)`, "g"), '');
  locals.repoRootPath = gitRootPath + locals.repo + '/';
  // locals.repoResourcePath = locals.repoRootPath + locals.path;
  locals.repoResourcePath = join(__dirname, 'repos', locals.path);
  locals.repoResourceParentPathEls = locals.repoResourcePath.split('/');
  locals.repoResourceName = locals.repoResourceParentPathEls.pop();
  locals.repoResourceParentPath = locals.repoResourceParentPathEls.join('/') + '/';
  locals.isDir = fs.existsSync(locals.repoResourcePath) && fs.lstatSync(locals.repoResourcePath).isDirectory();
  if (locals.isDir && locals.repoResourcePath[locals.repoResourcePath.length - 1] != '/') locals.repoResourcePath += '/';
  locals.method = req.method;
  locals.contentType = req.headers['content-type'];

  console.log(
    '+++++++++++' + '\n' +
    '  setVars' + '\n' +
    'locals.gitUser = ' + locals.gitUser + '\n' +
    'locals.repo = ' + locals.repo + '\n' +
    'locals.url = ' + locals.url + '\n' +
    'locals.path = ' + locals.path + '\n' +
    'locals.repoResourcePath = ' + locals.repoResourcePath + '\n' +
    'req.query.txt = ' + req.query.txt + '\n'
  );

  console.log(`\n+++++++\nadhocGetHtml @ ${locals.repoResourcePath}`);

  if (!locals.isDir) {
    // Files have data from route/repo data only, no git status or ls-files.
    jsonOut = {
      ...jsonOut,
      tpl: 'adhocGetHtml',
      repoRootPath: `${locals.repoRootPath}`,
      repoResourcePath: `${locals.repoResourcePath}`,
      isDir: locals.isDir,
      url: `${locals.url}`,
      method: `${locals.method}`,
      contentType: `${locals.contentType}`,
      gitUser: locals.gitUser,
      repo: locals.repo,
      path: `${locals.path}`,
      query_txt: `${req.query.txt}`,
      title: `${locals.title}`,
      is: `${locals.is}`,
      templateData: []
    };
    const testDir = join(__dirname, 'repos');
    console.log(`****************************** \n`+
    `testDir = ${testDir}`);
    fs.readdir(testDir, function (err, items) {
      if (err) {
        res.json(err);
        return;
      }
      if (!items) {
        console.log('no items');
        return;
      }
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
      }
    });


    // Get file contents
    console.log(`file to read: ${locals.repoResourcePath}`);
    // res.json( jsonOut );
    fs.readFile(`${locals.repoResourcePath}`,
      (err, data) => {
        if (err) {
          // console.error(`Read file error : ${err}`);
          res.json(err);
          return;
        };
        locals.fileText = data;
        console.log(`file : ${locals.repoResourcePath}\n${locals.fileText}`);
        jsonOut = {
          ...jsonOut,
          fileText: `${locals.fileText}`,
        };
        // locals.fileHashes =  new AdHash( {text: data } );
        // console.log(locals.fileHashes.hashes);
        // jsonOut = { 
        //   ...jsonOut,
        //   fileText: `${locals.fileText}`,
        //   fileHashes: locals.fileHashes.hashes,
        // };

        const newFileText = req.query.txt ? req.query.txt : 'nada';
        fs.writeFile(`${locals.repoResourcePath}`, newFileText, function (err) {
          if (err) return console.log(err);
          console.log(`createText`);
        });

        res.json(jsonOut);
      }
    );

  } else {
    // Directories have data from route/repo data, git status, and ls-files.
    jsonOut = {
      ...jsonOut,
      tpl: 'adhocGetHtml',
      repoRootPath: `${locals.repoRootPath}`,
      repoResourcePath: `${locals.repoResourcePath}`,
      isDir: `${locals.isDir}`,
      url: `${locals.url}`,
      method: `${locals.method}`,
      contentType: `${locals.contentType}`,
      gitUser: locals.gitUser,
      repo: locals.repo,
      path: `${locals.path}`,
      title: `${locals.title}`,
      is: `${locals.is}`,
      statusMsg: '',
      lsFilesMsg: '',
      templateData: []
    };
    res.json(jsonOut);
  }
}
