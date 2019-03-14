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
        if(data[0] === '/'){
            if(data[1] === 'w'){
                let paramaters = data.split(' ');
                    if(paramaters.length < 3){
                        client.write('Invalid paramaters')
                    }
                    else if(client.name == paramaters[1] || users.length > 2){
                        client.write('Invalid guest amount/ Invalid input')
                    }
                    else{
                        paramaters.shift();
                        console.log(paramaters);
                        
                        let find = false;
                            for (let v = 0; v < users.length; v++) {
                                if(users[v].name == paramaters[0]){
                                    users[v].write(client.name + ' whispered ' + paramaters[1]);
                                    client.write('whisper sent')
                                    find = true;
                                }
                            }
                        if(!find){
                            client.write('invalid name')
                        }
                    }
            }
            if(data[1] === 'u'){
                let paramaters = data.split(' ');
                    if(paramaters.length < 2){
                        client.write('invalid command')
                    }
                    else{
                        paramaters.shift();
                        console.log(paramaters);
                        
                        let find = false;
                            for (let v = 0; v < users.length; v++) {
                                if(users[v].name == paramaters[0]){
                                    find = true;
                                }
                            }
                        if(find){
                            client.write('name already exists')
                        }
                        else{
                            let oldname = client.name;
                            client.name = paramaters[0];
                            console.log(oldname + " changed their name to " + client.name)
                            for (let a = 0; a < users.length; a++) {
                                users[a].write(oldname + " changed their name to " + client.name)
                            }
                        }
                    }
                
            }
            if(data[1] === 'k'){
                let paramaters = data.split(' ');
                    if(paramaters.length < 3){
                        client.write('Invalid paramaters')
                    }
                    if(paramaters[2].slice(0, -1) === 'password'){
                        client.write('password correct, kicking player');
                        paramaters.shift();
                        console.log(paramaters);
                        
                        let find = false;
                        let banned;
                            for (let v = 0; v < users.length; v++) {
                                if(users[v].name == paramaters[0]){
                                    banned = users[v].name;
                                    users[v].end();
                                    console.log(users)
                                    
                                    find = true;
                                }
                            }
                                if(find){
                                    client.write('kick successful');
                                    console.log(banned + ' was kicked')
                                    for (let a = 0; a < users.length; a++) {
                                        users[a].write(banned + " was kicked")
                                    }
                                }
                                else{
                                    client.write('user does not exist')
                                }
                    }
                    else{
                        client.write('password incorrect')
                    }
                    
            }
        }
        else{
            fs.appendFile('./chat.log', client.name + ': ' + data, (error) => {if (error) throw error});
            console.log(client.name + ': ' + data);
            for(let i = 0; i < users.length; i++) {
                if(client.name != users[i].name){
                    users[i].write(client.name + ': ' + data);
                }
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