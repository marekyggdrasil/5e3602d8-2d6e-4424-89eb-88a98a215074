var config = {};

config.mongo = {};
config.beanstalkd = {};
config.worker = {};

config.mongo.server = 'localhost';
config.mongo.port = 27017;

config.beanstalkd.host = 'challenge.aftership.net';
config.beanstalkd.tube = ['marekyggdrasil'];
config.beanstalkd.port = 11300;

config.worker.id = 'Terminator T-800';

module.exports = config;
