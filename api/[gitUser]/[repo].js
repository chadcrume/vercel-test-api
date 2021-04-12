const { GoogleAuth } = require('google-auth-library');

/**
* Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
* this library will automatically choose the right client based on the environment.
*/
async function main() {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  console.log(`auth = ${auth}`);
  const projectId = await auth.getProjectId();
  console.log(`projectId = ${projectId}`);
  const client = await auth.getClient();
  console.log(`client = ${client}`);
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
  const res = client.request({ url }).then(() => {
    console.log('DNS Info:');
    console.log(res.data);

  });
}

main().catch(console.error);

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client using Application Default Credentials
// const storage = new Storage();

// Creates a client from a Google service account key
// const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
console.log(`process.env.GOOGLE_APPLICATION_CREDENTIALS = ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
console.log(`process.env.GCLOUD_CREDENTIALS = ${process.env.GCLOUD_CREDENTIALS}`);
const GCP_int_cred = process.env.GCLOUD_CREDENTIALS ?
  JSON.parse(
    Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString()
  ) : null;
const GCP_cred = process.env.GOOGLE_APPLICATION_CREDENTIALS ?
  process.env.GOOGLE_APPLICATION_CREDENTIALS : GCP_int_cred;


  console.log(`GCP_cred = ${GCP_cred}`);
if (GCP_cred) console.log(`GCP_cred.client_email = ${GCP_cred.client_email}`);
// client_email
// project_id
// private_key

// const storage = new Storage();
const storage = new Storage({
  projectId: GCP_cred.project_id,
  credentials: GCP_cred
});

async function uploadFile(
  bucketName = 'my-bucket',
  filePath = './local/path/to/file.txt',
  destFileName = 'file.txt'
) {
  const bucket = storage.bucket(bucketName);
  // console.log('bucket:');
  // console.log(bucket);
  const file = bucket.file('test.txt');
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { 'x-goog-meta-test': 'data' },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  console.log(response);

  console.log(`bucket = ${bucket.url}`);
  // Get Bucket Metadata
  const [metadata] = await storage.bucket(bucketName).getMetadata().catch(console.error);

  for (const [key, value] of Object.entries(metadata)) {
    console.log(`${key}: ${value}`);
  }
  console.log(`Uploading ${filePath} to ${bucketName} :: ${destFileName}`);

  await storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });

  console.log(`${filePath} uploaded to ${bucketName}`);
}

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
        console.log(`file : ${locals.repoResourcePath}`);
        console.log(`fileText : ${locals.fileText}`);
        jsonOut = {
          ...jsonOut,
          fileText: `${locals.fileText}`,
          client_email: GCP_cred.client_email,
          project_id: GCP_cred.project_id,
          private_key: GCP_cred.private_key,
          GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          GCLOUD_CREDENTIALS: process.env.GCLOUD_CREDENTIALS,
        };

        // locals.fileHashes =  new AdHash( {text: data } );
        // console.log(locals.fileHashes.hashes);
        // jsonOut = { 
        //   ...jsonOut,
        //   fileText: `${locals.fileText}`,
        //   fileHashes: locals.fileHashes.hashes,
        // };

        async function listBuckets() {
          try {
            console.log('Listing Buckets 2 ...');
            storage.getBuckets(function (err, buckets) {
              if (!err) {
                console.log('Buckets:');
                buckets.forEach(bucket => {
                  console.log(bucket.name);
                });
                // buckets is an array of Bucket objects.
              } else {
                console.log('Buckets err:');
                console.log(err);
              }
            });

            console.log('Listing Buckets ...');
            const results = await storage.getBuckets();

            console.log('Buckets results:');
            console.log(results);
            const [buckets] = results ? results : [];

            console.log('Buckets:');
            buckets.forEach(bucket => {
              console.log(bucket.name);
            });

          } catch (err) {
            console.error('ERROR:', err);
          }
        }
        listBuckets();

        const newFileText = req.query.txt ? req.query.txt : 'nada';

        uploadFile(
          'vercel_test_storage',
          locals.repoResourcePath,
          `file-${Date.now()}.txt`
        ).catch(console.error);

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

