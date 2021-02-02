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
  console.log(` -- ${reqVars.deckName}`);
  // console.log(` -- ${req.getHeader('Content-Type')}`);
  var jsonOut = {
    deckName: reqVars.deckName
  };
  const csvFilePath = 'deckData/' + reqVars.deckName + '.csv';
  console.log(`csvFilePath -- ${csvFilePath}`);
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
    method: req.method,
    protocol: req.protocol,
    host: req.host,
    path: req.path,
    query: req.query,
    deckName: req.query.deckName,
  };
  return jsonOut;
}

// app.listen(port, () => {
//     console.log(`Server listening on the port::${port}`);
// });