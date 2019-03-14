const net = require('net');
const fs = require('fs');
var users = [];


let server = net.createServer(client => {
    index = client.length;
    client.id = users.length;
    client.name = 'guest' + users.length;
    users.push(client);
    client.setEncoding('utf8')
    console.log(client.name + ' has joined');
    fs.appendFile('./chat.log', client.name + ' has joined\n', (error) => {if (error) throw error});
    for(let i = 0; i < users.length; i++) {
        if(client.name != users[i].name){
            users[i].write(client.name + ' has joined');   
        }
        else{
            users[i].write('Server: Welcome to the server!');
        }
    }
    client.on('data', data => {
        fs.appendFile('./chat.log', client.name + ': ' + data, (error) => {if (error) throw error});
        console.log(client.name + ': ' + data);
        for(let i = 0; i < users.length; i++) {
            if(client.name != users[i].name){
                users[i].write(client.name + ': ' + data);
            }
        }
    })
    client.on('close', function() {
        fs.appendFile('./chat.log', client.name + ' has left\n', (error) => {if (error) throw error});
        console.log(client.name + ' left the chat');
            for (let x = 0; x < users.length; x++) {
                if(client.name == users[x]){
                    users.splice(x, 1);
                } 
            }
    });

}).listen(5000);

// process.stdin.pipe(client);

console.log('Listening on Port 5000')
fs.appendFile('./chat.log', 'Server started\n', (error) => {if (error) throw error});