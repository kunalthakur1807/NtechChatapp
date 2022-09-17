const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
let userSocket;
let userModel;
let MessageModel;
async function main() {
  await mongoose.connect(
    "mongodb+srv://sagar:sagar@cluster0.homzwob.mongodb.net/?retryWrites=true&w=majority"
  );
  const userSocketSchema = new mongoose.Schema({
    user_id: String,
    socket_id: String,
  });

  const userSchema = new mongoose.Schema({
    name: String,
    user_id: String,
    socket_id: String,
    password: String,
  });
  const messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    time: String,
  });

  userSocket = mongoose.model("user_socket", userSocketSchema);
  userModel = mongoose.model("user", userSchema);
  MessageModel = mongoose.model("message", messageSchema);
}
main().catch((error) => console.log(error));

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

io.on("connection", (socket) => {
  socket.on("get_users", (data) => {
    if (data.userId) {
      userModel
        .find({ _id: data.userId })
        .exec()
        .then((res) => {
          res[0].socket_id = socket.id;

          userModel.update(
            { _id: res[0]._id },
            res[0],
            { upsert: true },
            (err) => {
              console.error("update failed", err);
            }
          );
          // const user = new userModel(res[0]);
          // user.update();
        });

      const filter = {};
      const all = userModel.find(filter).exec();
      all.then((res) => {
        io.to(socket.id).emit("get_users_result", res);
      });
    }
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_room_message", (data) => {
    socket.to(data.room).emit("receive_room_message", data);
  });

  socket.on("send_message", async (data) => {
    if (data.to != "") {
      let fileter = { _id: data.to };
      let user = await userModel.find(fileter).exec();
      if (user.length > 0) {
        // console.log(user[0]);
        let message = new MessageModel(data);
        message.save();
        io.to(user[0].socket_id).emit("receive_message", data);

        console.log(data);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    let user = userModel.find({ socket_id: socket.id }).exec();
    // if()
    // user.socket_id = null;

    // user.save();
  });
  socket.on("login", (data) => {
    let loginUser = userModel.find({ name: data.name }).exec();
    let login = false;

    loginUser.then((res) => {
      if (res.length == 0) {
        const user = new userModel({
          name: data["name"],
          password: 123456,
          socket_id: socket.id,
        });
        user.save();

        login = true;
        io.to(socket.id).emit("login_result", {
          user,
          status: login,
          message: [],
        });
      } else {
        // res[0].socket_id = socket.id;
        console.log(res[0]);
        userModel.updateOne(
          { name: res[0].name },
          res[0],
          {
            upsert: true,
          },
          (err) => {
            console.error("update failed", err);
          }
        );
        const user = new userModel(res[0]);
        user.update();
        let id = res[0]._id.toString();
        let messages = MessageModel.find({
          $or: [{ to: id }, { from: id }],
        })
          .sort({ time: "desc" })
          .exec();
        messages.then((message) => {
          console.log(message);
          io.to(socket.id).emit("login_result", {
            user: res[0],
            status: login,
            messages: message,
          });
        });
      }
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
