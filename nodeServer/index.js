// Node server to handle io connections.
// const io = require("socket.io")(8000);
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS", // "changeit" encrypted with bcrypt
  },
  readonly: true,
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    // console.log("new user", name);
    users[socket.id] = name;
    socket.broadcast.emit("New user joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
