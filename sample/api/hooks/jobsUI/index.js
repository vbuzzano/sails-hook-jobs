module.exports = function(sails) {

  var agendaUI = require('agenda-ui');

  // return hook
  return {

    // Defaults config
    defaults: {

      jobsUI: {
        "enabled": false,
        "path": "/jobs",
        "pool": 1000
      }
    },

/*    routes: {
      before: {
        '/jobs': agendaUI(agenda, {poll: 1000})
      }
    },
*/

    configure: function() {
    },

    // Runs automatically when the hook initializes
    initialize: function (cb) {
      var hook = this
        , config = sails.config.jobsUI;

      // Lets wait on some of the sails core hooks to
      // finish loading before we load our hook
      // that talks about cats.
      var eventsToWaitFor = [];

      if (sails.hooks.jobs)
        eventsToWaitFor.push('hook:jobs:loaded');
      else
        return cb("Missing hook dependencie -> sails-hook-jobs");

      sails.after(eventsToWaitFor, function(){
        setTimeout(function() {
          sails.hooks.http.app.use('/agenda-ui', agendaUI(sails.hooks.jobs.jobs, {poll: 1000}));
        console.log("start ui");
        }, 5000);


        // Now we will return the callback and our hook
        // will be usable.
        return cb();
      });
    }
  }
};
