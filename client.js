const net = require('net');

let client = net.createConnection({port: 5000}, () => {
    console.log('Connected')
    client.on('data', data => {
        console.log(data.toString())
    })
    client.on('close', () => {
        console.log('Server closed connection');
        process.exit();
    })
})

process.stdin.pipe(client);


