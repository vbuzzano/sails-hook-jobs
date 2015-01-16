/**
 * Default jobs configuration
 * (sails.config.jobs)
 *
 * For more information using jobs in your app, check out:
 * https://github.com/vbuzzano/sails-hook-jobs
 */

var os = require("os");

module.exports.jobs = {
  "jobsDirectory": "api/jobs",
  "db": { 
    "address"    : "localhost:27017/jobs",
    "collection" : "agendaJobs" 
  },
  "name": os.hostname() + '-' + process.pid,
  "processEvery": "10 seconds",
//  "maxConcurrency": 20,
//  "defaultConcurrency": 5,
//  "defaultLockLifetime": 10000
};