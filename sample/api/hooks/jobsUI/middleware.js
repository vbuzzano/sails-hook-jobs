var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

module.exports = function() {
    var agenda = new Agenda({db: { address: 'localhost:27017/jobs', collection: 'agendaJobs' }})
    return agendaUI(agenda, {poll: 1000});
}
