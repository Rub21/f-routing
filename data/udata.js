#!/usr/bin/env node

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var fs = require("fs");
var ProgressBar = require('ascii-progress');
var firebase = require('firebase');

function readJSON(p) {
    var contents = fs.readFileSync(p);
    return JSON.parse(contents);
}

//var config = {
//    apiKey: "AIzaSyDAk4WRCP4zx4JhkF2czVu4LJkzvVMN_Rg",
//    authDomain: "roads-a384c.firebaseapp.com",
//    databaseURL: "https://roads-a384c.firebaseio.com",
//    projectId: "roads-a384c",
//    storageBucket: "roads-a384c.appspot.com",
//    messagingSenderId: "1005333787675"
//};
var config = {
    apiKey: "AIzaSyCdzFXh3lnra26ujzMqEqmRqucsu4Xwcrc",
    authDomain: "i-data-85f05.firebaseapp.com",
    databaseURL: "https://i-data-85f05.firebaseio.com",
    projectId: "i-data-85f05",
    storageBucket: "i-data-85f05.appspot.com",
    messagingSenderId: "834555292442"
  };
firebase.initializeApp(config);

if (argv._.length > 0) {
    for (var i = 0; i < argv._.length; i++) {
        var jsonContent = readJSON(argv._[i]);
        var c = jsonContent.features.length;

        for (var j = 0; j < c; j++) {
            var item = jsonContent.features[j];
            var r = firebase.database().ref('features/'+j);
            r.set(item);
            console.log(j);
        }
        console.log('\x1b[32m%s\x1b[0m', argv._[i] + ' Complete!');
        //process.exit(0);
    }
} else {
    console.log('\x1b[36m%s\x1b[0m', 'Without parameters Usually :');
    console.log('\x1b[33m%s\x1b[0m', 'udata *dense.geojson');
    console.log('\x1b[33m%s\x1b[0m', 'udata m*-f*.geojson');
}