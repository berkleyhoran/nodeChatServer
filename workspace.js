const net = require('net');
var users = [];


let server = net.createServer(client => {
    index = client.length;
    client.id = users.length;
    client.name = 'guest' + users.length;
    users.push(client);
    client.setEncoding('utf8')
    console.log(client.name + ' has joined');
    for(let i = 0; i < users.length; i++) {
        if(client.name != users[i].name){
            users[i].write(client.name + ' has joined');   
        }
        else{
            users[i].write('Server: Welcome to the server!');
        }
    }
    client.on('data', data => {
        for(let i = 0; i < users.length; i++) {
            if(client.name != users[i].name){
                users[i].write(users[i].name + ': ' + data);
            }
            console.log(users[i].name + ': ' + data);
        }
    })
    client.on('close', function() {
        console.log(client.name + ' left the chat');
            for (let x = 0; x < users.length; x++) {
                if(client.name === users[x]){
                    users.splice(x, 1);
                } 
            }
    });

}).listen(5000);

// process.stdin.pipe(client);

console.log('Listening on Port 5000')