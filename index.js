const express = require('express');
const app = express();
const http = require("http");
const path = require('path');


let jwt = require('jsonwebtoken');

const {Server} = require('socket.io');
const cors = require("cors")

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"]
    }
});

let activeUsers = []

let users = {};

io.on("connection", (socket) => {
    const token = socket.handshake.query.token;

    let decode;

        try{
            decode = jwt.verify(token, '12urMomsAHoe34sheSlobsOnMyNob56sheTakinThisDick78ILaidHerStriaght910WeAintKin');
        }catch{
            return socket.emit("receive_message", {
                username: "SERVER",
                message: "[ONLY YOU CAN SEE THIS] You need a token to be able to send messages in this version. You can still view messages though."
            }); 
        }

        if (!users[decode.user_id]){

            users[decode.user_id] = []
            users[decode.user_id].push({
                username: decode.username,
                identifier: decode.identifier,
                status: decode.status,
                id: decode.user_id,
                avatar: decode.avatar
            });
        }

        
        socket.broadcast.emit("active_users", users);
        
    

    socket.on("send_message", (data) => {

        

        // Check data before sending to all clients. Check JWT token too.
        if(data.message === "!help"){
            // socket.broadcast.emit("receive_message", data);
            data = {
                username: decode.username,
                identifier: decode.identifier,
                message: data.message
            }
            socket.emit("receive_message", data);
            socket.broadcast.emit("receive_message", data);

            data.message = "The Fuck you mean you need help? It's level 1 dude. Try !imdum"
            data.username = "SERVER"


            socket.broadcast.emit("receive_message", data);
            socket.emit("receive_message", data);
            
     
        }
        else if(data.message === "!imdum"){
            // socket.broadcast.emit("receive_message", data);
            data = {
                username: decode.username,
                identifier: decode.identifier,
                message: data.message
            }
            socket.emit("receive_message", data);
            socket.broadcast.emit("receive_message", data);

            data.message = "lmfao U291bmRzIGxpa2UgeW91IG5lZWQgSEVMUA=="
            data.username = "SERVER"


            socket.broadcast.emit("receive_message", data);
            socket.emit("receive_message", data);
            
     
        }
        
        else if(data.message === "133645576714"){
            socket.broadcast.emit("receive_message", data);
            socket.emit("receive_message", data);
        }
        
        else{
            if(data.message !== ""){

                console.log("Okkk")
                data = {
                    username: decode.username,
                    identifier: decode.identifier,
                    message: data.message,
                    avatar: decode.avatar
                }
                socket.broadcast.emit("receive_message", data);
                socket.emit("receive_message", data);
            }
            
        }
        
    })


    socket.on("user_action", (data) => {

        

        let data2 = {
            type: data.type,
            username: decode.username,
            identifier: decode.identifier
        }

        socket.broadcast.emit("user_action", data2);
        socket.emit("user_action", data2);

        

        // Check data before sending to all clients. Check JWT token too.


      
    })

    socket.on("active_users", (data) => {
        //console.log(data)
        console.log(users)

        socket.emit("active_users", users);

        // socket.broadcast.emit("user_action", data2);
        // socket.emit("user_action", data2);

        

        // Check data before sending to all clients. Check JWT token too.


      
    })
})
const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log("Server going")
})