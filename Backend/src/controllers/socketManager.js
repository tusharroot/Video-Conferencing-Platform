import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToScoket = (server) => {
  const io = new Server(server,{
    cors:{
      origin: "https://emeetfrontend.onrender.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });
  io.on("connection", (socket) => {

    console.log("Something is connected");
    
    socket.on("join-call", (path) => {

      if (connections[path] === undefined) {
          connections[path] = []
      }
      connections[path].push(socket.id)

      timeOnline[socket.id] = new Date();

      // connections[path].forEach(elem => {
      //     io.to(elem)
      // })

      for (let a = 0; a < connections[path].length; a++) {
          io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
      }

      if (messages[path] !== undefined) {
          for (let a = 0; a < messages[path].length; ++a) {
              io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                  messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
          }
      }
    });
    socket.on("signal", (told, message) => {
      io.to(told).emit("signal", socket.id, message);
    });
    socket.on("chat-message", (data, sender) => {
        const [matchingRoom,found] = Object.entries(connections).reduce(([room,isFound],[roomKey,roomValue])=>{
            if(!isFound && roomValue.includes(socket.id)){
                return[roomKey,true]
            }
            return[room,isFound]
        },['',false]);

        
        if(found===true){
            if(messages[matchingRoom]===undefined){
                messages[matchingRoom] = []
            }

            messages[matchingRoom].push({'sender':sender,'data':data,'socket-id-sender':socket.id})
            console.log("message",matchingRoom,":",sender,data);

            connections[matchingRoom].forEach((element) => {
                io.to(element).emit('chat-message',data,sender,socket.id)
            });
            
        }
    });
    socket.on("disconect", () => {

        var diffrence = Math.abs(timeOnline[socket.id]-new Date())

        for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

            for(let a=0;a<v.length;++a){
                if(v[a]===socket.id){
                    key = k
                    for (let a = 0; a < connections[key].length; ++a) {
                        io.to(connections[key][a]).emit('user-left',socket.id)
                        
                    }

                    var index = connections[key].indexOf(socket.id)

                    connections[key].splice(index,1)


                    if(connections[key].length === 0){
                        delete connections[key]
                    }
                }
            }
        }
    });
  });
  return io;
};
