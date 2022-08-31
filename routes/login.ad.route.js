const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ActiveDirectory = require('activedirectory');
const { connAttrsAD } = require('../config/conection');


// Use body parser to parse JSON body
router.use(bodyParser.json());


var ad = new ActiveDirectory(connAttrsAD);

const domain = "@bairral.local";

// Http Method: GET
// URI        : /ad
// Retona true se validado no AD
router.get('/', function (req, res, next) {
  "use strict";

  if ("application/json" !== req.get('Content-Type')) {
    res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content-type. Only application/json is supported",
      detailed_message: null
    }));
    return;
  }

  ad.authenticate(req.body.user + domain, req.body.pass, function (err, auth) {
    if (err) {
      res.contentType('application/json')
        .status(200).send(JSON.stringify([{ "Erro": "Usuário ou senha invalidos" }, err]));
      return;
    }

    if (auth) {
      res.contentType('application/json')
        .status(200).send(JSON.stringify([{ "Authentication": auth }]));

    }
    else {
      console.log('Authentication failed!');
    }
  });
});


// Http Method: GET
// URI        : /ad/grupo
// Retona todos grupos do usuário no AD
router.get('/grupo', function (req, res, next) {
  "use strict";

  if ("application/json" !== req.get('Content-Type')) {
    res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content-type. Only application/json is supported",
      detailed_message: null
    }));
    return;
  }

  ad.authenticate(req.body.user + domain, req.body.pass, function (err, auth) {
    if (err) {
      res.contentType('application/json')
        .status(200).send(JSON.stringify([{ "Erro": "Usuário ou senha invalidos" }, err]));
      return;
    }

    if (auth) {
      ad.getGroupMembershipForUser(req.body.user + domain, function (err, groups) {
        if (err) {
          res.contentType('application/json')
            .status(200).send(JSON.stringify(err));
          return;
        }

        if (!groups) console.log('User: ' + req.body.user + domain + ' not found.');
        else res.contentType('application/json').status(200).send(JSON.stringify(groups));
      });
    }
    else {
      console.log('Authentication failed!');
    }
  });
});


// Http Method: GET
// URI        : /ad/membro
// Retona se usuário é membro de um grupo no AD
router.get('/membro', function (req, res, next) {
  "use strict";

  if ("application/json" !== req.get('Content-Type')) {
    res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content-type. Only application/json is supported",
      detailed_message: null
    }));
    return;
  }

  ad.authenticate(req.body.user + domain, req.body.pass, function (err, auth) {
    if (err) {
      res.contentType('application/json')
        .status(200).send(JSON.stringify([{ "Erro": "Usuário ou senha invalidos" }, err]));
      return;
    }

    if (auth) {
      ad.isUserMemberOf(req.body.user + domain, req.body.group, function (err, isMember) {
        if (err) {
          res.contentType('application/json')
            .status(200).send(JSON.stringify(err));
          return;
        }

        res.contentType('application/json')
          .status(200).send(JSON.stringify([{ "user": req.body.user, "isMemberOf": req.body.group, "value": isMember }]));
      });
    }
    else {
      console.log('Authentication failed!');
    }
  });
});

// Http Method: GET
// URI        : /ad/membros
// Retona todos membros de um grupo no AD
router.get('/membros', function (req, res, next) {
  "use strict";

  if ("application/json" !== req.get('Content-Type')) {
    res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
      status: 415,
      message: "Wrong content-type. Only application/json is supported",
      detailed_message: null
    }));
    return;
  }

  ad.authenticate(req.body.user + domain, req.body.pass, function (err, auth) {
    if (err) {
      res.contentType('application/json')
        .status(200).send(JSON.stringify([{ "Erro": "Usuário ou senha invalidos" }, err]));
      return;
    }

    if (auth) {
      ad.getUsersForGroup(req.body.group, function (err, users) {
        if (err) {
          res.contentType('application/json')
            .status(200).send(JSON.stringify(err));
          return;
        }
        if (!users) res.contentType('application/json')
          .status(200).send(JSON.stringify([{ "Group": req.body.group, "erro": "not found" }]));
        else
          res.contentType('application/json')
            .status(200).send(JSON.stringify(users));
      });
    }
    else {
      console.log('Authentication failed!');
    }
  });
});

module.exports = router;
