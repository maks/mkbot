var irc = require('irc');
var client = new irc.Client('irc.freenode.net', 'jsgitbot', {
    channels: ['#js-git'],
});

client.addListener('message', function (from, to, message) {
    var dts = new Date().toISOString();
    console.log('['+dts+'] '+from + ' => ' + to + ': ' + message);
});

