/*jshint node:true */
"use strict";

var fs = require('fs'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    irc = require('irc'),
    strftime = require('strftime'),
    channels = ['#js-git'],
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
       channels: channels
    });

http.createServer(
  ecstatic(httpdOpts)
).listen(PORT);


client.addListener('message', function (from, to, message) {
    toLog(to, '< '+ from + '> ' + message);
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
});

client.addListener('error', function(message) {
    console.error('error: ', message);
});

client.addListener('registered', function(message) {
   console.log('registered ok');
});

client.addListener('join', function(channel, nick, message) {
   toLog(channel, nick + ' has joined '+channel);
});

client.addListener('part', function(channel, nick, reason, message) {
   toLog(channel, nick + ' has left '+channel);
});

client.addListener('quit', function(nick, reason, channels, message) {
   //FIXME: need to iterate over all channels
    //toLog(channel, nick + ' has disconnected');
});

function toLog(chan, str) {
    var now = new Date(),
        dts = strftime('%T %z', new Date()),
        filename = __dirname+'/public/logs/'+chan.replace(/#*/,'')+'/'+strftime('%F')+".txt";

    fs.appendFile(filename, '['+dts+'] '+str+"\n", function (err) {
       if (err) {
           console.error('error appending to logfile '+filename+' '+err);
       }
    });
}


