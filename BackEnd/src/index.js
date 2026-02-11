import dotenv from 'dotenv';
import http from 'http';
import crypto from 'crypto';
import connectDB from "./db/index.js";
import app from "./app.js"


dotenv.config()


// connectDB()
//     .then(() => {
//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is running on Port${process.env.PORT}`)
//         })
//     })
//     .catch((error) => {
//         console.log("Error", error)
//         throw error;
//     })

    connectDB()
    .then(()=>{
        const server = http.createServer(app);
        // webshoket handshake implementation
        server.on("upgrade", (req, soket, head)=>{
            if(req.headers["upgrade"]!=="websoket"){
                soket.destroy();
                return;
            }
            const key = req.headers["sec-websocket-key"]
            if (!key) {
                soket.destroy()
                return
            }
            const acceptKey = crypto
            .createHash("sha1")
            .update(key+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
            .digest("base64")

            soket.write(
                "HTTP/1.1 101 Switching Protocols\r\n" +
          "Upgrade: websocket\r\n" +
          "Connection: Upgrade\r\n" +
          `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
          "\r\n"
            )
            console.log("✅ WebSocket handshake successful");
        
        soket.on("data", (buffer) => {
        console.log("Received raw data:", buffer);
      });

      soket.on("end", () => {
        console.log("Client disconnected");
      });
    })
const PORT = process.env.PORT || 8000

 server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB Error", error);
    process.exit(1);


    })
