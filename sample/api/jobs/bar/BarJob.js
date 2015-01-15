/**
 * Bar job - Example
 * 
 * @author Vincent Buzzano <vincent.buzzano@gmail.com>
 * 
 */
module.exports = function() {
    return {
//        name: 'Bar Job',
        frequency: 'now',
        run: function(job, done) {
            console.log("Bar Job executed");
            done();
        }
    }
}