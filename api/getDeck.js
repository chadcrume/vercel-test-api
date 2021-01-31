module.exports = getDeck;

// module.exports = (req, res) => {
//   res.json({
//     body: req.body,
//     query: req.query,
//     cookies: req.cookies,
//   })
// }

// app.get(["/deckData/:deckName/", "/deckData/:deckName/*"], getDeck);

// Set up REST end point
function getDeck(req, res) {
  console.log(`\n+++++++\n \
    getDeck`);
  const reqVars = setVars(req, res);
  console.log(`${reqVars.deckName} -- ${reqVars.contentType} -- ${req.headers('content-type')} -- ${req.getHeader('Content-Type')}`);
  var jsonOut = {
    deckName: reqVars.deckName
  };
  // req.is('json') <<=== This isn't working for some reason
  // if (req.get('content-type') == 'application/json') {
  // } else if (req.get('content-type') == 'text/html') {
  // } else {
  // }
  const csvFilePath = 'deckData/' + reqVars.deckName + '.csv';
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
}

function setVars(req, res) {
  var jsonOut = {
    type = req.getHeader('content-type'),
    contentType = req.getHeader('content-type'),
    method = req.method,
    protocol = req.protocol,
    host = req.host,
    path = decodeURIComponent(req.path),
    query = decodeURIComponent(req.query),
    deckName = decodeURIComponent(req.query.deckName),
  };
  return jsonOut;
}

// app.listen(port, () => {
//     console.log(`Server listening on the port::${port}`);
// });