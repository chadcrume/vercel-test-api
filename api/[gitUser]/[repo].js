import firebase from 'firebase/app';

if (!firebase.apps.length) firebase.initializeApp({
  apiKey: "AIzaSyBvLu3HlcsBkPDzJwQuLI5JXhIkv2jYUgc",
  authDomain: "ringed-robot-309714.firebaseapp.com",
  projectId: "ringed-robot-309714",
  storageBucket: "ringed-robot-309714.appspot.com",
  messagingSenderId: "476558642880",
  appId: "1:476558642880:web:0ed34e9814556462716725"
});
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
  var jsonOut = {};
  var locals = {};
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
    console.log(`****************************** \n`)
    const testDir = join(__dirname, '');
    const testDir1 = join(__dirname, 'repos');
    const testDir2 = join(__dirname, 'repos', 'mzc');
    const testDir3 = join(__dirname, 'repos', 'mzc', 'MAZC.txt');
    console.log(`exists??? === ${fs.existsSync(testDir)}`)
    console.log(`exists??? === ${fs.existsSync(testDir1)}`)
    console.log(`exists??? === ${fs.existsSync(testDir2)}`)
    console.log(`exists??? === ${fs.existsSync(testDir3)}`)
    console.log(`****************************** \n` +
      `testDir = ${testDir}`);
    fs.readdir(testDir, function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
        return;
      }
      if (!items) {
        console.log('no items');
        // res.json(jsonOut);
        // return;
      }
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
      }
      // res.json(jsonOut);
      return;
    });
    // return;


    // Get file contents
    console.log(`file to read: ${locals.repoResourcePath}`);
    // res.json( jsonOut );
    if (!fs.existsSync(testDir)) {
      console.log(`DOESN'T EXIST`);
      res.json(jsonOut);
      return;
    }
    fs.readFile(`${locals.repoResourcePath}`,
      (err, data) => {
        if (err) {
          // console.error(`Read file error : ${err}`);
          res.json(err);
          return;
        };
        locals.fileText = data;
        console.log(`file : ${locals.repoResourcePath}\n${locals.fileText}`);
        const { GCLOUD_CREDENTIALS } = require('./cloud.env').env
        const { client_email, private_key, project_id } = JSON.parse(
          Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString()
        );
        console.log(`process.env.PROJECT_ID = ${process.env.PROJECT_ID}`)
        jsonOut = {
          ...jsonOut,
          fileText: `${locals.fileText}`,
          client_email: client_email,
          project_id: project_id,
          private_key: private_key,
          GCLOUD_CREDENTIALS: GCLOUD_CREDENTIALS,
        };
        // GCLOUD_CREDENTIALS: process.env.GCLOUD_CREDENTIALS,
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
      templateData: [],
    };
    res.json(jsonOut);
  }
}
