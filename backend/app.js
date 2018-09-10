'use strict';

const base62 = require('base62/lib/ascii');
const cors = require('cors');
const express = require('express');
const Datastore = require('@google-cloud/datastore');

const app = express();
const datastore = new Datastore({
  projectId: 'bthles-204804',
  keyFilename: 'bthles-datastore.json',
});

app.use(cors());
app.use(express.json());
app.options('*', cors());

app.get('/', (req, res) => {
  res.status(200).send('static').end();
});

app.get('/:short', (req, res) => {
  // check for entry in short_index
  datastore.get(
      datastore.key(['short_index', req.params.short]), (err, entity) => {
        if (entity && entity.is_url) {
          // exists
          res.redirect(301, entity.content);
        } else {
          // doesn't exist - go to root
          res.redirect(301, '/');
        }
      });
});

app.post('/_create', (req, res) => {
  const url = req.body.url;
  const tx = datastore.transaction();

  tx.run((err) => {
    // check if link already exists
    tx.get(datastore.key(['long_index', url]), (err, entity) => {
      if (entity) {
        // link exists
        res.status(200).json({
          error: false,
          short: entity.short,
          existed: true,
        });
      } else {
        // link doesn't exist
        // find next short
        tx.get(datastore.key(['meta', 'meta']), (err, entity) => {
          const short = base62.encode(entity.count);
          // create long_index entry
          tx.save({
            key: datastore.key(['long_index', url]),
            data: {
              is_url: true,
              short: short,
            },
          });
          // create short_index entry
          tx.save({
            key: datastore.key(['short_index', short]),
            data: {
              content: url,
              hits: 0,
              is_url: true,
            },
          });
          // update meta count
          tx.save({
            key: datastore.key(['meta', 'meta']),
            data: {
              count: entity.count + 1,
            },
          });
          tx.commit((err, apiResponse) => {
            if (err) {
              res.status(500).json({
                error: true,
              });
            } else {
              res.status(200).json({
                error: false,
                short: short,
                existed: false,
              });
            }
          });
        });
      }
    });
  });
});

app.listen(8080);
