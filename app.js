const { getJSON, printEvent } = require('./functions.js')
let args = process.argv.slice(2)
let username = args[0]

const options = {
  host: 'api.github.com',
  port: 443,
  path: `/users/${username}/events`,
  method: 'GET',
  headers: {
    'User-Agent': 'GitHub User Activity',
    'Accept': 'application/vnd.github+json'
  }
};

getJSON(options, (statusCode, events) => {
  if(statusCode == 200) {
    for(let event of events) {
      printEvent(event)
    }
  } else {
    console.log(`Invalid username`)
  }
});