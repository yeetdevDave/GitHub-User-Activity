const http = require('http');
const https = require('https');

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function getJSON(options, onResult) {
  const port = options.port == 443 ? https : http;
  
  let output = '';

  const req = port.request(options, (res) => {
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      output += chunk;
    });

    res.on('end', () => {
      let obj = JSON.parse(output);

      onResult(res.statusCode, obj);
    });
  });

  req.on('error', (err) => {
    res.send('error: ' + err.message);
  });

  req.end();
};

function getEventType(event) {
  return event.type
}

function printPushEvent(event) {
  let commitsNumber = event.payload.commits.length
  let repoName = event.repo.name

  let msg = `- Pushed ${commitsNumber} commit${commitsNumber > 1 ? 's' : ''} to ${repoName}`

  console.log(msg)
}

function printIssuesEvent(event) {
  let action = capitalizeFirstLetter(event.payload.action)
  let repoName = event.repo.name

  let msg = `- ${action} `

  if(action == 'Opened') {
    msg += 'a new issue'
  } else {
    msg += 'an issue'
  }

  msg += ` in ${repoName}`

  console.log(msg)
}

function printWatchEvent(event) {
  let repoName = event.repo.name

  let msg = `- Starred ${repoName}`

  console.log(msg)
}

function printCreateEvent(event) {
  let ref = event.payload.ref
  let refType = event.payload.ref_type
  let repoName = event.repo.name
  let msg

  if(refType == 'repository') {
    msg = `- Created repository ${repoName}`
  } else if(refType == 'branch') {
    msg = `- Created branch ${ref} in ${repoName}`
  } else {
    return
  }

  console.log(msg)
}

function printDeleteEvent(event) {
  let ref = event.payload.ref
  let refType = event.payload.ref_type
  let repoName = event.repo.name
  let msg

  if(refType == 'branch') {
    msg = `- Deleted branch ${ref} in ${repoName}`

    console.log(msg)
  } 
  
  return
}

function printEvent(event) {
  let type = getEventType(event)

  switch(type) {
    case 'PushEvent':
      printPushEvent(event)
      break
    case 'IssuesEvent':
      printIssuesEvent(event)
      break
    case 'WatchEvent':
      printWatchEvent(event)
      break
    case 'CreateEvent':
      printCreateEvent(event)
      break
    case 'DeleteEvent':
      printDeleteEvent(event)
      break
  }
}

module.exports = { 
  capitalizeFirstLetter, getJSON, getEventType, printPushEvent, printIssuesEvent,
  printWatchEvent, printCreateEvent, printDeleteEvent, printEvent
}