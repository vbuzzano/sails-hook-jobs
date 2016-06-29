# sails-hook-agenda

Sails JS hook to add async background agenda.

This project use "agenda" as the job engine  
 - github: https://github.com/rschmukler/agenda
 - npmjs: https://www.npmjs.com/package/agenda

Agenda is a light-weight job scheduling library for Node.js. And it's use mongodb.

## Install

If your are using sails 0.11.x you just need to install it.

    npm install sails-hook-jobs

for sails 0.10.x, create a folder 'jobs' in your api/hooks folder and copy index.js from this project.

## Configuration

Copy this configurations file and save it to config/jobs.js

    /**
     * Default jobs configuration
     * (sails.config.jobs)
     *
     * For more information using agenda in your app, check out:
     * https://github.com/vbuzzano/sails-hook-jobs
     */
    module.exports.jobs = {
    
      // Where are jobs files
      "jobsDirectory": "api/jobs",

      // agenda configuration. 
      // for more details about configuration,
      // check https://github.com/rschmukler/agenda
      "db": { 
        "address"    : "localhost:27017/jobs",
        "collection" : "agendaJobs" 
      },
      "name": "process name",
      "processEvery": "10 seconds",
      "maxConcurrency": 20,
      "defaultConcurrency": 5,
      "defaultLockLifetime": 10000
    };

## How to define and schedule jobs

Simply create a js file (name ending with Job.js, eg: myJob.js) in api/jobs or in the 'jobsDirectory'.
(coffee script supported.)

    module.exports = function(agenda) {
        var job = {
        
            // job name (optional) if not set, 
            // Job name will be the file name or subfolder.filename (without .js)
            //name: 'Foo',
    
            // set true to disabled this hob
            //disabled: false,
    
            // method can be 'every <interval>', 'schedule <when>' or now
            //frequency supports cron strings
            frequency: 'every 5 seconds',
    
            // Jobs options
            //options: {
                // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
                //priority: 'highest'
            //},
            
            // Jobs data 
            //data: {},
            
            // execute job
            run: function(job, done) {
                console.log("Foo job executed");
                done();
            },
        };
        return job;
    }


## What you get ?
Once the hook started, you will have a new global object 'Jobs' wich is the instance of Agenda engine.

You can use it like that

    Jobs.now('jobname', data)
    Jobs.schedule('tommorrow at noon', 'jobname', {})
    ...

All found jobs with a run function will be defined and all jobs with freq will be sheduled.

## Problems to solve

- How to stop agenda correctly on sails lowering ??
- Purging jobs ??

