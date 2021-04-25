const allowCors = fn => async (req, res) => {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    const allowedOrigins = ['http://localhost', 'http://localhost:3001', '.vercel.app', 'https://vercel-test-api-cseeingsea.vercel.app', 'https://vue-examples.vercel.app']
    console.log(`req.headers.origin = ${req.headers.origin}`);
    if (allowedOrigins.find(item => req.headers.origin.includes(item))) {
      console.log('Access-Control-Allow-Origin');
      // res.setHeader('Access-Control-Allow-Origin', '*-cseeingsea.vercel.app')
      // res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
  }
  return await fn(req, res)
}

const handler = async (req, res) => {
  var jsonOut = {};

  console.log(`\n+++++++++++++++++++++++++++++++++++++++++++++++++\n \
    GCP test`);
  // Imports the Google Cloud client library
  const { Storage } = require('@google-cloud/storage');

  // console.log(`process.env.GCLOUD_CREDENTIALS = ${process.env.GCLOUD_CREDENTIALS}`);
  const GCP_cred = process.env.GCLOUD_CREDENTIALS ?
    JSON.parse(
      Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString()
    ) : null;

  console.log(`GCP_cred = ${GCP_cred}`);
  if (GCP_cred) {
    console.log(`GCP_cred.client_email = ${GCP_cred.client_email}`)
    console.log(`GCP_cred.project_id = ${GCP_cred.project_id}`);
    console.log(`GCP_cred.client_email = ${GCP_cred.client_email}`);
  };

  // For more information on ways to initialize Storage, please see
  // https://googleapis.dev/nodejs/storage/latest/Storage.html

  const storage = new Storage({
    projectId: GCP_cred.project_id,
    credentials: GCP_cred,
    maxRetries: 3,
  });
  console.log(`storage = ${storage}`);

  jsonOut = {
    ...jsonOut,
    client_email: GCP_cred.client_email,
    project_id: GCP_cred.project_id,
  };
  // private_key: GCP_cred.private_key,
  // GCLOUD_CREDENTIALS: process.env.GCLOUD_CREDENTIALS,

  // console.log(`Example from https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-nodejs`);

  // /**
  //  * TODO(developer): Uncomment these variables before running the sample.
  //  */
  // // The ID of your GCS bucket
  // const bucketName = 'your-unique-bucket-name';
  // console.log(`bucketName = ${bucketName}`);

  // async function createBucket() {
  //   // Creates the new bucket
  //   await storage.createBucket(bucketName);
  //   console.log(`Bucket ${bucketName} created.`);
  // }

  // createBucket().catch(console.error);

  // console.log(`Example from https://cloud.google.com/storage/docs/listing-buckets#code-samples`);
  // async function listBuckets() {
  //   try {
  //     const [buckets] = await storage.getBuckets();

  //     console.log('Buckets:');
  //     buckets.forEach(bucket => {
  //       console.log(bucket.name);
  //     });

  //     jsonOut = {
  //       ...jsonOut,
  //       buckets: buckets,
  //     };
  //   } catch (err) {
  //     console.error('ERROR:', err);
  //   }
  // }
  // await listBuckets().catch(console.error);

  // console.log(`Example from https://googleapis.dev/nodejs/storage/latest/Storage.html#bucket`);
  // const albums = storage.bucket('albums');
  // console.log(`albums = ${albums}`);
  // console.log(`albums.exists() = ${albums.exists(function (err, exists) {
  //   console.log(`err = ${err}`);
  //   console.log(`exists = ${exists}`);
  // })}`);

  async function uploadFile(
    bucketName = 'my-bucket',
    filePath = './file.txt',
    destFileName = 'file.txt'
  ) {
    const bucket = storage.bucket(bucketName);

    const file = bucket.file('test.txt');
    console.log(`file = ${file}`);
    const options = {
      expires: Date.now() + 1 * 60 * 1000, //  1 minute,
      fields: { 'x-goog-meta-test': 'data' },
    };

    const [response] = await file.generateSignedPostPolicyV4(options);
    console.log(response);

    console.log(`bucket = ${bucket}`);
    // Get Bucket Metadata
    const [metadata] = await bucket.getMetadata().catch(console.error);
    console.log(`metadata: ${metadata}`);

    for (const [key, value] of Object.entries(metadata)) {
      console.log(`${key}: ${value}`);
    }
    console.log(`Uploading ${filePath} to ${bucketName} :: ${destFileName}`);

    await storage.bucket(bucketName).upload(filePath, {
      destination: destFileName,
    });

    console.log(`${filePath} uploaded to ${bucketName}`);
  }

  async function saveFile(
    bucketName = 'my-bucket',
    filePath = './file.txt',
    fileContent = 'nada'
  ) {

    const bucket = storage.bucket(bucketName);

    const file = bucket.file(filePath);
    console.log(`file = ${file}`);

    // await file.exists(function (err, exists) { 
    //   console.log(`file exists.exists = ${exists}`);
    // });

    console.log(`Saving to ${bucketName}: ${filePath}`);
    console.log(`fileContent: ${fileContent}`);

    // //-
    // // If the callback is omitted, we'll return a Promise.
    // //-
    // file.save(fileContent).then(function () { });
    await file.save(fileContent);

    console.log(`Saved to ${bucketName}: ${filePath}`);
  }


  console.log(`\n+++++++++++++++++++++++++++++++++++++++++++++++++\n \
    Work with doc/file`);

  const { join } = require('path')
  const fs = require('fs');
  const { promisify } = require('util');

  console.log(`\n+++++++\nadhocSetVars`);
  var locals = {};
  locals.method = req.method;
  locals.contentType = req.headers['content-type'];
  locals.gitUser = decodeURIComponent(req.query.gitUser);
  locals.repo = decodeURIComponent(req.query.repo);
  locals.path = decodeURIComponent(req.url)
    .replace(new RegExp(`/api/${locals.gitUser}/${locals.repo}/?`, "g"), '')
    .replace(new RegExp(`\\?(.*)`, "g"), '');
  locals.relativeRepoResourcePath = join('repos', locals.gitUser, locals.repo, locals.path);
  locals.fileContent = req.query.txt;

  console.log(
    '+++++++++++' + '\n' +
    '  setVars' + '\n' +
    'locals.gitUser = ' + locals.gitUser + '\n' +
    'locals.repo = ' + locals.repo + '\n' +
    'locals.path = ' + locals.path + '\n' +
    'locals.relativeRepoResourcePath = ' + locals.relativeRepoResourcePath + '\n' +
    'locals.fileContent = ' + locals.fileContent + '\n'
  );

  // await uploadFile(
  //   'vercel_test_storage',
  //   locals.localRepoResourcePath,
  //   locals.relativeRepoResourcePath
  // ).catch(console.error);
  // // `test/file-${Date.now()}.txt`

  await saveFile(
    'vercel_test_storage',
    locals.relativeRepoResourcePath,
    locals.fileContent
  ).catch(console.error);
  // `test/file-${Date.now()}.txt`

  console.log(`\n+++++++\nadhocGetHtml @ ${locals.relativeRepoResourcePath}`);

  jsonOut = {
    ...jsonOut,
    tpl: 'adhocGetHtml',
    method: `${locals.method}`,
    contentType: `${locals.contentType}`,
    relativeRepoResourcePath: `${locals.relativeRepoResourcePath}`,
    gitUser: locals.gitUser,
    repo: locals.repo,
    path: `${locals.path}`,
    query_txt: `${req.query.txt}`,
  };
  res.json(jsonOut);

  // console.log(`****************************** \n`)
  // const testDir = join(__dirname, '');
  // const testDir1 = join(__dirname, 'repos');
  // const testDir2 = join(__dirname, 'repos', 'mzc');
  // const testDir3 = join(__dirname, 'repos', 'mzc', 'MAZC.txt');
  // console.log(`exists??? === ${fs.existsSync(testDir)}`)
  // console.log(`exists??? === ${fs.existsSync(testDir1)}`)
  // console.log(`exists??? === ${fs.existsSync(testDir2)}`)
  // console.log(`exists??? === ${fs.existsSync(testDir3)}`)
  // console.log(`****************************** \n` +
  //   `testDir = ${testDir}`);
  // fs.readdir(testDir, function (err, items) {
  //   if (err) {
  //     console.log(err);
  //     res.json(err);
  //     return;
  //   }
  //   if (!items) {
  //     console.log('no items');
  //     // res.json(jsonOut);
  //     // return;
  //   }
  //   console.log(items);
  //   for (var i = 0; i < items.length; i++) {
  //     console.log(items[i]);
  //   }
  //   // res.json(jsonOut);
  //   return;
  // });
  // // return;


  // // Get file contents
  // console.log(`file to read: ${locals.localRepoResourcePath}`);
  // let readFilePromise = promisify(fs.readFile);

  // readFilePromise(`${locals.localRepoResourcePath}`).then((data) => {

  //   locals.fileText = data;
  //   const newFileText = req.query.txt ? req.query.txt : 'nada';
  //   console.log(`file : ${locals.localRepoResourcePath}`);
  //   console.log(`fileText : ${locals.fileText}`);
  //   console.log(`newFileText : ${newFileText}`);
  //   jsonOut = {
  //     ...jsonOut,
  //     fileText: `${locals.fileText}`,
  //   };

  //   // fs.writeFile(`${locals.localRepoResourcePath}`, newFileText, function (err) {
  //   //   if (err) return console.log(err);
  //   //   console.log(`createText`);
  //   // });

  //   res.json(jsonOut);

  // }).catch((err) => {
  //   // console.error(`Read file error : ${err}`);
  //   res.json(err);
  //   return;
  // });
}

module.exports = allowCors(handler)

