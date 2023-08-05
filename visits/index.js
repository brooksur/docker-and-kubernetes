const express = require('express')
const redis = require('redis')

const client = redis.createClient({
  host: 'redis-server', // name of the service in docker-compose.yml
  port: 6379 // default port for redis
})

const app = express()

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    if (!visits) visits = 1
    else {
      visits = parseInt(visits) + 1
    }
    res.send('Number of visits is ' + visits)
    client.set('visits', visits)
  })
})

app.listen(8081, () => {
  console.log('Listening on port 8081')
})
