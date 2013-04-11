/*jshint node:true */
"use strict";

var fs = require('fs'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    irc = require('irc'),
    strftime = require('strftime'),
    channel = '#js-git',
    botname = 'mkbot',
    PORT = 8001,
    HOST = 'manichord.com',
    httpdOpts = {
             root       : __dirname + '/public', 
             baseDir    : '/',
             cache      : 1,
             showDir    : true,
             autoIndex  : true,
             defaultExt : 'html', 
             gzip       : false
           },     
    client = new irc.Client('irc.freenode.net', botname, {
       channels: [channel]
    });

http.createServer(
  ecstatic(httpdOpts)
).listen(PORT);


client.addListener('message', function (from, to, message) {
    toLog(from + ' => ' + to + ': ' + message);
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
});

client.addListener('error', function(message) {
    console.error('error: ', message);
});

client.addListener('registered', function(message) {
   console.log('registered ok');
   announceMyself();
});

client.addListener('join', function(channel, nick, message) {
   toLog(nick + ' has joined '+channel);
   //announceMyself();
});

client.addListener('part', function(channel, nick, reason, message) {
   toLog(nick + ' has left '+channel);
});

client.addListener('quit', function(nick, reason, channels, message) {
   toLog(nick + ' has discoonected');
});

function toLog(str) {
    var now = new Date(),
        dts = strftime('%F %T %z', new Date()),
        filename = __dirname+'/public/logs/'+strftime('%F')+".txt";

    fs.appendFile(filename, '['+dts+'] '+str+"\n", function (err) {
       if (err) {
           console.error('error appending to logfile '+filename+' '+err);
       }
    });
}

function announceMyself() {
    client.say(channel, "Hi I'm "+botname+" and I'm logging this channel. Log archive at: http://"+HOST+':'+PORT+'/logs/');
}


