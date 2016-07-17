'use strict';

const request = require('request');
const cradle = require('cradle');
let activityIds = null;
let startPoint = null;
let endPoint = null;

// const fs = require('fs');
const databaseInit = function (dbname) {
  const dbCredentials = {
    username: 'fae6ccea-dceb-439f-8432-27130c8703b6-bluemix',
    password: 'bce3cd710a9673fc4267d1bb7dded5f035d83afd06deae32ffaffff59d8147a7',
    host: 'fae6ccea-dceb-439f-8432-27130c8703b6-bluemix.cloudant.com',
    port: 443,
  };

  const database = new (cradle.Connection)(dbCredentials.host, dbCredentials.port, {
    secure: true,
    auth: {
      username: dbCredentials.username,
      password: dbCredentials.password,
    },
    cache: true,
    raw: false,
    forceSave: true,
  }).database(dbname);

  return database;
};

const getListFromAPI = function (req, callback) {
  const location = req.params.location;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  const options = {
    uri: `http://terminal2.expedia.com:80/x/activities/search?location=${location}&startDate=${startDate}&endDate=${endDate}`,
    headers: {
      'Authorization': 'expedia-apikey key=A9RmQEh9NsuGhSs0NfBsdYadLZQYycgY',
    },
  };
  console.log(options.uri);
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const json = JSON.parse(body);
      let i = 0;
      const filteredActvt = [];

      for (; i < json.activities.length; i++) {
        if (json.activities[i].duration !== null && json.activities[i].duration.indexOf('d') < 0) {
          filteredActvt.push(json.activities[i]);
        }
      }

      filteredActvt.sort((a, b) => {
        return b.recommendationScore - a.recommendationScore;
      });

      json.activities = filteredActvt;
      json.total = filteredActvt.length;

      return callback(json);
    }

    return callback(null);
  });
};

const getDetailFromAPI = function (req, callback) {
  const activityId = req.params.activityId;
  const options = {
    uri: `http://terminal2.expedia.com:80/x/activities/details?activityId=${activityId}`,
    headers: {
      'Authorization': 'expedia-apikey key=A9RmQEh9NsuGhSs0NfBsdYadLZQYycgY',
    },
  };
  console.log(options.uri);
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      return callback(JSON.parse(body));
    }

    return callback(null);
  });
};

const getLat = function (node) {
  const result = node.latLng.split(',');

  return result[0];
};

const getLng = function (node) {
  const result = node.latLng.split(',');

  return result[1];
};

const getPoints = function (nodeList) {
  let maxLat = getLat(nodeList[0]);
  let minLat = getLat(nodeList[0]);
  let maxLng = getLng(nodeList[0]);
  let minLng = getLng(nodeList[0]);
  let centerLat = getLat(nodeList[0]);
  let centerLng = getLng(nodeList[0]);
  let disToTop = 0.0;
  let disToBtm = 0.0;
  let disToLft = 0.0;
  let disToRht = 0.0;
  let disAll = 0.0;

  for (let i = 1; i < nodeList.length; i++) {
    const lat = getLat(nodeList[i]);
    const lng = getLng(nodeList[i]);
    if (lat > maxLat) {
      maxLat = lat;
    }
    else if (lat < minLat) {
      minLat = lat;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
    else if (lng < minLng) {
      minLng = lng;
    }
  }

  centerLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
  centerLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
  disToTop = parseFloat(maxLat) - parseFloat(centerLat);
  disToBtm = parseFloat(centerLat) - parseFloat(minLat);
  disToLft = parseFloat(centerLng) - parseFloat(minLng);
  disToRht = parseFloat(maxLng) - parseFloat(centerLng);
  disAll = disToTop + disToBtm + disToLft + disToRht;

  return {
    'lftTop': // left top point
    {
      'lat': maxLat,
      'lng': minLng,
    },
    'lftBtm':
    {
      'lat': minLat,
      'lng': minLng,
    },
    'rgtTop': {
      'lat': maxLat,
      'lng': maxLng,
    },
    'rgtBtm': { // right bottom point
      'lat': minLat,
      'lng': maxLng,
    },
    'center': { // center point
      'lat': centerLat,
      'lng': centerLng,
    },
    'dtnLft': disToLft, // distance from center to left
    'dtnTop': disToTop,
    'dtnRht': disToRht,
    'dtnBtm': disToBtm,
    'dtnAll': disAll,
  };
};

// Return recommendation routing via the recommendationScore
const cal1 = function (result) {
  const res = {};
  result.sort((a, b) => {
    return b.recommendationScore - a.recommendationScore;
  });

  const finalResult = [];
  finalResult.push({});

  let startActivity = null;
  let endActivity = null;

  for (let i = 0; i < result.length; i++) {
    if (result[i].id === startPoint) {
      startActivity = result[i];
    }
    else if (result[i].id === endPoint) {
      endActivity = result[i];
    }
    else {
      finalResult.push(result[i]);
    }
  }
  finalResult[0] = startActivity;
  finalResult.push(endActivity);
  res.activities = finalResult;
  res.points = getPoints(result);

  return res;
};

const calculateRouting = function (req, callback) {
  const result = [];
  let count = 0;

  const isCompeleted = function () {
    if (count === activityIds.length) {
      return callback(cal1(result));
    }

    return null;
  };

  const processData = function (activityId) {
    const database = databaseInit('activity');
    const id = activityId.toString();
    database.get(id, (err, doc) => {
      console.log('Search key: ', id);
      if (err) {
        const options = {
          uri: `http://terminal2.expedia.com:80/x/activities/details?activityId=${id}`,
          headers: {
            'Authorization': 'expedia-apikey key=A9RmQEh9NsuGhSs0NfBsdYadLZQYycgY',
          },
        };
        console.log(options.uri);
        request.get(options, (error, response, body) => {
          const data = JSON.parse(body);
          if (!error && response.statusCode === 200) {
            database.save(id, data, (err2, doc2) => {
              console.log('Save key: ', id);
              if (err2) {
                console.error(err2);
              }
              else {
                console.log(doc2);
              }
              delete data.offersDetail;
              result.push(data);
              count++;
              isCompeleted();
            });
          }
        });
      }
      else {
        const res = doc;
        delete res.offersDetail;
        result.push(res);
        count++;
      }
      isCompeleted();
    });
  };

  for (let i = 0; i < activityIds.length; i++) {
    processData(activityIds[i]);
  }
};

const loadData = function (req, res, dbKey, dbname, callback) {
  const database = databaseInit(dbname);
  database.get(dbKey, (err, doc) => {
    console.log('Search key: ', dbKey, 'DB: ', dbname);
    if (err) {
      return callback(req, (body) => {
        if (body === null) {
          res.json('NOT FOUND');
        }
        else {
          database.save(dbKey, body, (err2, doc2) => {
            console.log('Save key: ', dbKey, 'DB: ', dbname);
            if (err2) {
              console.error(err2);
            }
            else {
              console.log(doc2);
              res.json(body);
            }
          });
        }
      });
    }

    return res.json(doc);
  });
};

module.exports.getActivity = function (req, res) {
  const dbKey = req.params.activityId;

  return loadData(req, res, dbKey, 'activity', getDetailFromAPI);
};

module.exports.getActivities = function (req, res) {
  const dbKey = `${req.params.location}_${req.params.startDate}_${req.params.endDate}`;

  return loadData(req, res, dbKey, 'activities', getListFromAPI);
};

module.exports.getRouting = function (req, res) {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });

  req.on('end', () => {
    const ids = JSON.parse(body);
    activityIds = ids.ids;
    startPoint = ids.startPoint;
    endPoint = ids.endPoint;

    const dbKey = ids.ids.join('_');

    return loadData(req, res, dbKey, 'routing', calculateRouting);
  });
};
