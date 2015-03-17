module.exports = function(sails) {

  var Agenda = require('agenda'),
    util   = require('util'),
    _      = require('lodash'),
    os     = require("os"),
    agenda = new Agenda()

  agenda.sails = sails;

  var stopServer = function() {
    agenda.stop(function() {
      console.log("agenda stopped");
    });
  };

  sails.on("lower", stopServer);
  sails.on("lowering", stopServer);

  // return hook
  return {
    
    // expose agenda in sails.hooks.jobs.agenda
    jobs: agenda,
    
    // Defaults config
    defaults: {

      jobs: {
        "globalJobsObjectName": "Jobs",
        "jobsDirectory": "api/jobs",
        "db": { 
            "address"    : "localhost:27017/jobs",
            "collection" : "agendaJobs" 
        },
        "name": os.hostname() + '-' + process.pid,
        "processEvery": "1 minutes",
        "maxConcurrency": 20,
        "defaultConcurrency": 5,
        "defaultLockLifetime": 10000,
      }
    },

    // Runs automatically when the hook initializes
    initialize: function (cb) {
      var hook = this
        , config = sails.config.jobs

     // init agenda
      agenda
        .database(config.db.address, config.db.collection)
        .name(config.name)
        .processEvery(config.processEvery)
        .maxConcurrency(config.maxConcurrency)
        .defaultConcurrency(config.defaultConcurrency)
        .defaultLockLifetime(config.defaultLockLifetime)

      global[config.globalJobsObjectName] = agenda;

      // Enable jobs using coffeescript
      try {
        require('coffee-script/register');
      } catch(e0) {
        try {
          var path = require('path');
          var appPath = sails.config.appPath || process.cwd();
          require(path.join(appPath, 'node_modules/coffee-script/register'));
        } catch(e1) {
          sails.log.verbose('Please run `npm install coffee-script` to use coffescript (skipping for now)');
        }
      }

      // Find all jobs
      var jobs = require('include-all')({
          dirname     : sails.config.appPath + '/' + config.jobsDirectory,
          filter      : /(.+Job).(?:js|coffee)$/,
          excludeDirs : /^\.(git|svn)$/,
          optional    : true
      });

      // init jobs
      hook.initJobs(jobs);

      // Lets wait on some of the sails core hooks to
      // finish loading before we load our hook
      // that talks about cats. 
      var eventsToWaitFor = [];

      if (sails.hooks.orm)
        eventsToWaitFor.push('hook:orm:loaded');

      if (sails.hooks.pubsub)
        eventsToWaitFor.push('hook:pubsub:loaded');

      sails.after(eventsToWaitFor, function(){
        
//        if (jobs.length > 0) {
          // start agenda
          agenda.start();
          sails.log.verbose("sails jobs started")
//        }
        
        // Now we will return the callback and our hook
        // will be usable.
        return cb();
      });
    },

    /**
     * Function that initialize jobs
     */
    initJobs: function(jobs, namespace) {
      var hook = this
      if (!namespace) namespace = "jobs";
      sails.log.verbose("looking for job in " + namespace + "... ")
      _.forEach(jobs, function(job, name){
        if (typeof job === 'function') {
          var log = ""
            , _job = job(agenda)
            , _dn   = namespace + "." + name
            , _name = _job.name || _dn.substr(_dn.indexOf('.') +1);

          if (_job.disabled) {
            log += "-> Disabled Job '" + _name + "' found in '" + namespace + "." + name + "'.";
          } else {
            var options = (typeof _job.options === 'object')?_job.options:{}
              , freq = _job.frequency
              , error = false;

            if (typeof _job.run === "function")
              agenda.define(_name, options, _job.run);

            log += "-> Job '" + _name + "' found in '" + namespace + "." + name + "', defined in agenda";
            if (typeof freq === 'string') {
              freq = freq.trim().toLowerCase();
              if (freq.indexOf('every') == 0) {
                var interval = freq.substr(6).trim();
                agenda.every(interval, _name, _job.data);
                log += " and will run " + freq;
              } else if (freq.indexOf('schedule') == 0) {
                var when = freq.substr(9).trim();
                agenda.schedule(when, _name, _job.data);
                log += " and scheduled " + when;
              } else if (freq === 'now') {
                agenda.now(_name, _job.data);
                log += " and started";
              } else {
                error = true;
                log += " but frequency is not supported";
              }
            }
          }
          log += ".";
          if (error) sails.log.error(log);
          else sails.log.verbose(log);
        } else {
          hook.initJobs(job, namespace + "." + name);
        }
      })
    }
  }
};
