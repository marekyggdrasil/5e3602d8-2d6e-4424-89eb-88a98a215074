# Introduction #

- Gets USD to HKD exchange rate once every minute, stores 10 succesful results in MongoDB.
- After 3 failed attempts, aborts.
- System is scalable horizontally as long as every worker gets different id and has connection to same Beanstalkd tube and same MongoDB.
- May require updating xe.com custom API in case if xe.com decides to change their HTML structure.

# Files #

- ./worker.js

Initiates worker node.

- ./producer.js

Used only to seed the initial task.

- ./peak.js

Simple admin tools, let's see if there is a job delayed in the queue.

- ./remove.js

Simple admin tools, let's see if there is a job delayed in the queue and removes it.

- ./database.js

Contains all access functions to MongoDB, it is done the way allowing not reconnecting at each request (connection pool)

- ./apixe.js

Custom API to access xe.com service.

- ./handlers/getrates.js

Handler that performs processing of task obtained from Beanstalkd tube.

# Dependencies #

- `soupselect`, `htmlparser` and `http` for custom xe.com API.
- `fivebeans` for worker, peak and producer, to access Beanstalkd queue.
- `mongodb` for accessing MongoDB database.

# Remarks #

- System is designed to store 10 succesful readings, restarting without clearing record collection will not allow storage 10 new readings.
- Processing is stopped after 3 failures, not necessarily 3 consecutive failures.
- Database is called `test`, records are stored in `aftership` collection and failed attempts in `failures` collection, failures are purged once processing ends.
