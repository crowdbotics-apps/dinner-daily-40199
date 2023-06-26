const router = require('express').Router();
const rfr = require("rfr");
const path = require("path");

const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");

// When no route match with defined routes in route.js for get request
// router.get('*', function(req, res) {
//   let resObj = Object.assign({}, utils.getErrorResObj());
//   resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
//   resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
//   res.status(404).send(resObj);
// });

router.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// When no route match with defined routes in route.js for post request
router.post('*', function(req, res) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
  resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
  res.status(404).send(resObj);
});

// When no route match with defined routes in route.js for put request
router.put('*', function(req, res) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
  resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
  res.status(404).send(resObj);
});

// When no route match with defined routes in route.js for delete request
router.delete('*', function(req, res) {
  let resObj = Object.assign({}, utils.getErrorResObj());
  resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
  resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
  res.status(404).send(resObj);
});

module.exports = router;
