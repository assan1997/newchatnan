const http = require('http');
const express = require('express');
const websocket = require('ws');
const db = require('./config/db');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const wss = new websocket.Server({ server: server });
const route = require('./api/router.js');
const port = process.env.PORT || 7001;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', route);
const { globalQueries } = require('./api/controller');
//websocket session
const users_connected_id = [];
wss.on('connection', (ws) => {
  console.log('user connected');
  ws.on('message', async (message) => {
    const m = JSON.parse(message);
    console.log('data m', m);
    switch (m.type) {
      case 'connect':
        try {
          ws.id = parseInt(m.user_id);
          ws.rooms = m.usersRooms;
          users_connected_id.includes(ws.id)
            ? users_connected_id.splice(
                users_connected_id.indexOf(ws.id),
                1,
                ws.id
              )
            : users_connected_id.push(ws.id);

          console.log('ajouté', users_connected_id);
          wss.clients.forEach((client) => {
            if (client.id !== ws.id) {
              client.send(
                JSON.stringify({
                  type: m.type,
                  feedBack: {
                    message: 'utilisateurs en ligne',
                    status: 'online',
                    users_connected: ws.id,
                  },
                })
              );
            }
          });
          ws.send(
            JSON.stringify({
              type: m.type,
              feedBack: {
                message: 'utilisateurs en ligne',
                status: 'online',
                users_connected: users_connected_id.filter((u) => u !== ws.id),
              },
            })
          );
        } catch (err) {
          throw err;
        }

        break;
      case 'isTyping':
        try {
          if (m.chatType !== 'single') {
            wss.clients.forEach((client) => {
              if (
                client !== ws &&
                client.rooms.find(
                  (c) => c.chatType === m.chatType && m.chatId === m.chatId
                )
              ) {
                client.send(
                  JSON.stringify({
                    type: m.type,
                    feedBack: {
                      message: m.message,
                      chatType: m.chatType,
                      chatId: m.chatId,
                    },
                  })
                );
              }
            });
          } else {
            wss.clients.forEach((client) => {
              if (client.id === m.peer_id) {
                client.send(
                  JSON.stringify({
                    type: m.type,
                    feedBack: {
                      message: m.message,
                      chatType: m.chatType,
                      chatId: m.chatId,
                      peer_id: ws.id,
                    },
                  })
                );
              }
            });
          }
        } catch (err) {
          throw err;
        }

        break;
      case 'stopTyping':
        try {
        } catch (err) {
          if (m.chatType !== 'group') {
            wss.clients.forEach((client) => {
              if (
                client !== ws &&
                client.rooms.find(
                  (c) => c.chatType === m.chatType && m.chatId === m.chatId
                )
              ) {
                client.send(
                  JSON.stringify({
                    type: m.type,
                    feedBack: {
                      message: m.message,
                      chatType: m.chatType,
                      chatId: m.chatId,
                    },
                  })
                );
              }
            });
          } else {
            wss.clients.forEach((client) => {
              if (client.id === m.peer_id) {
                client.send(
                  JSON.stringify({
                    type: m.type,
                    chatType: m.chatType,
                    feedBack: {
                      message: m.message,
                      chatType: m.chatType,
                      chatId: m.chatId,
                      peer_id: ws.id,
                    },
                  })
                );
              }
            });
          }
        }
        break;
      case 'markAllMessagesSeen':
        try {
          switch (m.chatType) {
            case 'single':
              await globalQueries.markAllMessagesSeen({
                userId: m.userId,
                peerId: m.peerId,
                chatType: m.chatType,
              });
              wss.clients.forEach((client) => {
                if (client.id === m.peerId) {
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      chatType: m.chatType,

                      feedBack: {
                        chatId: m.chatId,
                        chatType: m.chatType,
                        classroomId: m.classroomId,
                        id: m.userId,
                      },
                    })
                  );
                }
              });
              break;
            default:
              let data = {
                classroomChat: {
                  userId: m.userId,
                  classroomId: m.classroomId,
                  schoolId: m.schoolId,
                  chatType: m.chatType,
                },
                subjectChat: {
                  userId: m.userId,
                  classroomId: m.classroomId,
                  schoolId: m.schoolId,
                  subjectId: m.subjectId,
                  chatType: m.chatType,
                },
                teacherChat: {
                  userId: m.userId,
                  classroomId: m.classroomId,
                  schoolId: m.schoolId,
                  chatType: m.chatType,
                },
              };
              await globalQueries.markAllMessagesSeen(data[m.chatType]);
              wss.clients.forEach((client) => {
                if (
                  ws != client &&
                  client.rooms.find(
                    (c) => c.chatType === m.chatType && m.chatId === m.chatId
                  )
                ) {
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      chatType: m.chatType,
                      feedBack: {
                        chatId: m.chatId,
                        id: m.userId,
                        classroomId: m.classroomId,
                      },
                    })
                  );
                }
              });
              break;
          }
          break;
        } catch (err) {
          trow(err);
        }

      case 'readMessage':
        try {
          switch (m.chatType) {
            case 'single':
              await globalQueries.markAllMessagesSeen({
                userId: m.userId,
                peerId: m.peerId,
                chatType: m.chatType,
              });
              wss.clients.forEach((client) => {
                if (client.id === m.peerId) {
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      feedBack: {
                        chatType: m.chatType,
                        chatId: m.chatId,
                        message_id: m.message_id,
                        senderId: ws.id,
                        classroomId: m.classroomId,
                      },
                    })
                  );
                }
              });
              break;
            default:
              await globalQueries.markAllMessagesSeen(m);
              wss.clients.forEach((client) => {
                if (
                  client !== ws &&
                  client.rooms.find(
                    (c) => c.chatType == m.chatType && m.chatId === m.chatId
                  )
                ) {
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      feedBack: {
                        chatId: m.chatId,
                        chatType: m.chatType,
                        message_id: m.message_id,
                        classroomId: m.classroomId,
                      },
                    })
                  );
                }
              });
          }
        } catch (err) {
          throw err;
        }
        break;
      case 'readGroupMessage':
        try {
          wss.clients.forEach((client) => {
            if (m.users.includes(client.id)) {
              client.send(
                JSON.stringify({
                  type: m.type,
                  feedBack: {
                    classroomId: m.classroomId,
                    schoolId: m.schoolId,
                    readerId: m.userId,
                    message_id: m.message_id,
                  },
                })
              );
            }
          });
          let result = await globalQueries.readGroupMessage({
            userId: m.userId,
            classroomId: m.classroomId,
            schoolId: m.schoolId,
            msg_id: m.message_id,
          });
        } catch (err) {
          throw err;
        }
        break;
      case 'sendMessage':
        try {
          const message_data = m;
          switch (m.chatType) {
            case 'single':
              console.log('oui nono');
              wss.clients.forEach((client) => {
                if (client.id === m.peerId) {
                  console.log('send');
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      feedBack: {
                        chatType: m.chatType,
                        chatId: m.chatId,
                        data: m.data,
                        chatPrecise: m.chatPrecise,
                        senderId: m.senderId,
                        classroomId: m.classroomId,
                      },
                    })
                  );
                }
              });
              output = await globalQueries.SingleMessages(message_data);
              ws.send(
                JSON.stringify({
                  type: 'messageSaved',
                  feedBack: { id: output.id },
                })
              );
              break;
            default:
              // console.log("data group", m);
              wss.clients.forEach((client) => {
                if (
                  client !== ws &&
                  client.rooms.find(
                    (c) => c.chatType === m.chatType && m.chatId === m.chatId
                  )
                ) {
                  client.send(
                    JSON.stringify({
                      type: m.type,
                      feedBack: {
                        chatType: m.chatType,
                        message: m.data,
                        chatId: m.chatId,
                        senderId: m.senderId,
                        classroomId: m.classroomId,
                      },
                    })
                  );
                }
              });
              output = await globalQueries.GroupsMessages(message_data);
              break;
          }
          break;
        } catch (err) {
          throw err;
        }
      default:
        break;
    }
  });
  ws.on('close', () => {
    console.log('egrge', ws.id);
    wss.clients.forEach((client) => {
      if (client.id !== ws.id) {
        client.send(
          JSON.stringify({
            type: 'disconnect',
            feedBack: {
              message: 'logout',
              status: 'offline',
              user_id: ws.id,
            },
          })
        );
      }
    });
  });
  //users_connected_id.splice(users_connected_id.indexOf(ws.id), 1);
});

// end websocket session

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`app running on port : ${port}`);
  db();
});

/* end */
