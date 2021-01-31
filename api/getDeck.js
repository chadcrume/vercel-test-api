// module.exports = getDeck;

module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}

// app.get(["/deckData/:deckName/", "/deckData/:deckName/*"], getDeck);

// Set up REST end point
function getDeck(req, res, next) {
  console.log(`\n+++++++\n \
    getDeck`);
  setVars(req, res);
  console.log(`${res.locals.deckName} -- ${res.locals.contentType} -- ${req.get('content-type')}`);
  var jsonOut = {
    deckName: res.locals.deckName
  };
  // req.is('json') <<=== This isn't working for some reason
  // if (req.get('content-type') == 'application/json') {
  // } else if (req.get('content-type') == 'text/html') {
  // } else {
  // }
  const csvFilePath = 'deckData/' + res.locals.deckName + '.csv';
  const csv = require('csvtojson');
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      jsonOut = {
        ...jsonOut,
        cards: jsonObj
      };
      // console.log(jsonObj);
      res.setHeader('Content-Type', 'application/json');
      res.json(jsonOut);
    })

  // res.render("repo", (err, html) => {
  //   console.log(`${res.locals.deckName} -- ${res.locals.contentType} -- ${req.get('content-type')}`);
  //   // req.is('json') <<=== This isn't working for some reason
  //   // if (req.get('content-type') == 'application/json') {
  //   // } else if (req.get('content-type') == 'text/html') {
  //   // } else {
  //   // }
  //   const csvFilePath = 'deckData/' + res.locals.deckName + '.csv';
  //   const csv = require('csvtojson');
  //   csv()
  //     .fromFile(csvFilePath)
  //     .then((jsonObj) => {
  //       jsonOut = jsonObj;
  //       // console.log(jsonObj);
  //       res.setHeader('Content-Type', 'application/json');
  //       res.json(jsonOut);
  //     })

  //   // // Async / await usage
  //   // const jsonArray=await csv().fromFile(csvFilePath);
  //   // console.log(jsonObj);
  // });

  // next();
}

function setVars(req, res) {
  jsonOut = {};
  res.locals.type = req.get('content-type');
  res.locals.type2 = req.type;
  res.locals.is = req.is('json');
  res.locals.url = decodeURIComponent(req.url);
  res.locals.deckName = decodeURIComponent(req.params.deckName);
  res.locals.method = req.method;
  res.locals.contentType = req.get('content-type');
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});