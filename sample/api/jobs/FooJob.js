/**
 * Foo job - Example
 * 
 * @author Vincent Buzzano <vincent.buzzano@gmail.com>
 * 
 */
module.exports = function(agenda) {
    var job = {
        
        // job name
//        name: 'Foo',

        // set true if this job is disabled
        disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'every 10 seconds',

        // options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 'highest'
        },
        
        // data send to job in job.attrs.data
        data: {
            
        },
        
        initialize: function(sails) {
            
        },

        // execute job
        run: function(job, done) {
            console.log("Foo job executed");
            done();
        },
    };
    return job;
}
