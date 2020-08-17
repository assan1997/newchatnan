const User = require('../models/users.model');
const Classroom = require('../models/classroom.model');
const SingleChat = require('../models/peerTopeer/singleChat.model');
const SingleChatMessages = require('../models/peerToPeerMessages/singleChatMessage.model');
const ClassroomChat = require('../models/ChatGroupRooms/classroomChatRoom.model');
const GroupsMessages = require('../models/MessagesGroupChatRooms/MessagesGroupClassroomsChatRoom.model');
const Emojis = require('../models/emojis.model');
const Subject = require('../models/ChatGroupRooms/subjectChatRoom.model');
const SubjectsMessages = require('../models/MessagesGroupChatRooms/MessagesGroupSubjectsChatRoom.model');
const Teacher = require('../models/ChatGroupRooms/teacherChatRoom.model');
const TeachersMessages = require('../models/MessagesGroupChatRooms/MessagesGroupTeachersChatRoom.model');
const e = require('express');

exports.globalQueries = class {
  //Users methods
  static createUser(data) {
    return new Promise(async (next) => {
      const user = await new User({
        ...data,
      });
      user
        .save()
        .then((r) => {
          next({ status: true, info: 'user created successful !', user: r });
        })
        .catch((err) => {
          next({ status: false, error: err });
        });
    });
  }

  // login
  static loginUser(data) {
    return new Promise(async (next) => {
      const user = await User.findOne({
        email: data.email,
        password: data.password,
      });
      if (user !== null) {
        next({ status: true, info: 'user logged successful !', user });
      } else {
        next({ status: false, info: `login or password don't match!` });
      }
    });
  }

  // classroom Method
  static createClassroom(data) {
    return new Promise(async (next) => {
      const classroom = await new Classroom({
        ...data,
      });
      classroom.save().then((r) => {
        next({
          status: true,
          data: r,
          info: `la ${data.name} a été crée avec succès`,
        });
      });
    });
  }
  //find
  static findAllTeachersData(data) {
    let { userId, classroomId, schoolId, subjectId, studentsIds } = data;
    return new Promise(async (next) => {
      let all_single_chats = [];
      for (let i = 0; i < studentsIds.length; i++) {
        const single_chat = await SingleChat.findOne({
          $or: [
            { initiator: userId, peer: studentsIds[i] },
            { initiator: studentsIds[i], peer: userId },
          ],
        }).populate('chat');
        if (single_chat !== null) {
          all_single_chats.push(single_chat);
        }
      }
      let classroom_chat = await ClassroomChat.findOne({
        schoolId: schoolId,
        classroomId: classroomId,
      }).populate('messages');
      let teacher_chat = await Teacher.findOne({
        schoolId: schoolId,
        classroomId: classroomId,
      }).populate('messages');
      let subject_chat = await Subject.findOne({
        schoolId: schoolId,
        classroomId: classroomId,
        subjectId: subjectId,
      }).populate('messages');
      next({
        status: true,
        info: 'all teacher data',
        data: {
          studentsChats: all_single_chats.length !== 0 ? all_single_chats : [],
          classroomChat: classroom_chat !== null ? classroom_chat : {},
          subjectChat: subject_chat !== null ? subject_chat : {},
          teacherChat: teacher_chat !== null ? teacher_chat : {},
        },
      });
    });
  }
  static findAllData(data) {
    return new Promise(async (next) => {
      let subjectChats = [];
      console.log('data , ', data);
      for (let el of data.subjects) {
        console.log('id ', el);
        let subject = await Subject.findOne({
          schoolId: data.schoolId,
          classroomId: data.classroomId,
          subjectId: el,
        }).select('messages');
        console.log('subject origin ', subject);
        if (subject != null) {
          let messages = await SubjectsMessages.findOne({
            _id: subject.messages,
          }).select('-_id messages');
          console.log('subject msg ', messages);
          if (messages && messages.messages) {
            subjectChats.push({ subjectId: el, messages: messages.messages });
          }
        }
      }

      console.log('chats ', subjectChats);
      let emojis = await Emojis.find().select('emojis');
      let classroom = await Classroom.findOne({
        id: parseInt(data.classroomId),
      }).then((r) => r);
      const userChats = await SingleChat.find({
        $or: [
          { initiator: parseInt(data.userId) },
          { peer: parseInt(data.userId) },
        ],
      }).populate('chat');
      //let classroom;
      // if (classroomId !== null) {
      //   classroom = await Classroom.findOne({ _id: classroomId._id }).then(
      //     (r) => r
      //   );
      // }
      let classroomChat = await ClassroomChat.findOne({
        classroomId: parseInt(data.classroomId),
        schoolId: parseInt(data.schoolId),
      })
        .select('messages')
        .populate('messages')
        .then((r) => r);
      console.log('cchat', classroomChat);
      if (classroomChat !== null) {
        let messages = classroomChat.messages;
        next({
          status: true,
          data: {
            classroom: classroom,
            userChats,
            groupChat: messages,
            subjectChats,
            emojis,
          },
        });
      } else {
        next({
          status: true,
          data: {
            classroom: classroom,
            userChats,
            groupChat: [],
            emojis,
            subjectChats,
          },
        });
      }
    });
  }

  //Messages Method
  static SingleMessages(data) {
    return new Promise(async (next) => {
      // const initiator = await User.findOne({ id: parseInt(data.senderId) });
      // const peer = await User.findOne({ id: parseInt(data.peerId) });
      let message = data.data;
      const single_chat = await SingleChat.findOne({
        $or: [
          { initiator: parseInt(data.senderId), peer: parseInt(data.peerId) },
          { initiator: parseInt(data.peerId), peer: parseInt(data.senderId) },
        ],
      });
      if (single_chat !== null) {
        let chat_message = await SingleChatMessages.findOne({
          _id: single_chat.chat,
        });
        chat_message.messages.push(message);
        chat_message
          .save()
          .then(() =>
            next({ status: true, info: 'save', id: message.message_id })
          );
      } else {
        const new_message = await new SingleChatMessages({
          messages: [{ ...message }],
        });
        let chat_message_id = await new_message.save().then((r) => r._id);
        const new_chat = await new SingleChat({
          initiator: parseInt(data.senderId),
          peer: parseInt(data.peerId),
          schoolId: data.schoolId,
          chat: chat_message_id,
        });
        new_chat
          .save()
          .then(() =>
            next({ status: true, info: 'save', id: message.message_id })
          );
      }
    });
  }

  static markAllMessagesSeen(data) {
    return new Promise(async (next) => {
      //const initiator = await User.findOne({ id: parseInt(data.userId) });
      if (data.chatType === 'single') {
        //const peer = await User.findOne({ id: parseInt(data.peerId) });
        const single_chat = await SingleChat.findOne({
          $or: [
            { initiator: parseInt(data.userId), peer: parseInt(data.peerId) },
            { initiator: parseInt(data.peerId), peer: parseInt(data.userId) },
          ],
        }).then((r) => (r ? r.chat : null));
        console.log(single_chat);
        let chat_message = await SingleChatMessages.findOne({
          _id: single_chat,
        });
        if (chat_message !== null) {
          chat_message.messages.map((ms) =>
            ms.senderId !== data.userId && ms.isSeen !== true
              ? (ms.isSeen = true)
              : (ms.isSeen = ms.isSeen)
          );
          chat_message.save().then(() => {
            next({ status: true, info: 'vues' });
          });
        }
      } else {
        let obj = {
          classroomChat: ClassroomChat,
          subjectChat: Subject,
          teacherChat: Teacher,
        };
        let groups = {
          classroomChat: GroupsMessages,
          subjectChat: SubjectsMessages,
          teacherChat: TeachersMessages,
        };
        let datas = {
          classroomChat: {
            schoolId: data.schoolId,
            classroomId: data.classroomId,
          },
          subjectChat: {
            schoolId: data.schoolId,
            classroomId: data.classroomId,
            subjectId: data.subjectId,
          },
          teacherChat: {
            schoolId: data.schoolId,
            classroomId: data.classroomId,
          },
        };
        const classroom_chat = await obj[data.chatType]
          .findOne(datas[data.chatType])
          .then((r) => (r ? r.messages : null));

        if (classroom_chat !== null) {
          const classroomMessages = await groups[data.chatType].findOne({
            _id: classroom_chat,
          });
          if (classroom_chat !== null && classroomMessages) {
            classroomMessages.messages.map((cmsg) =>
              cmsg.senderId !== data.userId &&
              !cmsg.readBy.includes(data.userId)
                ? cmsg.readBy.push(data.userId)
                : (cmsg.readBy = cmsg.readBy)
            );

            classroomMessages.save().then(() => {
              next({
                status: true,
                info: 'ok',
              });
            });
          }
        }
      }
    });
  }

  static markAllGroupMessagesSeen(data) {
    return new Promise(async (next) => {
      console.log(data);
      let classroomId = parseInt(data.classroomId);
      let schoolId = parseInt(data.schoolId);
      const group_chat_messages_id = await ClassroomChat.findOne({
        classroomId,
        schoolId,
      }).then((r) => r.messages);
      console.log(group_chat_messages_id);
      let chat_message = await GroupsMessages.findById(group_chat_messages_id);
      if (chat_message !== null) {
        chat_message.messages.map((ms) =>
          ms.senderId !== data.userId &&
          !ms.readBy.find((r) => r.id === data.userId)
            ? ms.readBy.push({ id: data.userId })
            : (ms.readBy = ms.readBy)
        );
        chat_message.save().then(() => {
          next({ status: true, info: 'vues' });
        });
      }
    });
  }

  static GroupsMessages(data) {
    return new Promise(async (next) => {
      let classroomId = parseInt(data.classroomId);
      let schoolId = parseInt(data.schoolId);
      let subjectId = parseInt(data.subjectId);
      let obj = {
        classroomChat: ClassroomChat,
        subjectChat: Subject,
        teacherChat: Teacher,
      };
      let datas = {
        classroomChat: {
          classroomId: classroomId,
          schoolId: schoolId,
        },
        subjectChat: {
          classroomId: classroomId,
          schoolId: schoolId,
          subjectId: subjectId,
        },
        teacherChat: {
          classroomId: classroomId,
          schoolId: schoolId,
        },
      };
      let msgChat = {
        classroomChat: GroupsMessages,
        subjectChat: SubjectsMessages,
        teacherChat: TeachersMessages,
      };

      let message = data.data;
      const groupChat = await obj[data.chatType].findOne(datas[data.chatType]);
      console.log('db groupChat ', groupChat);
      if (groupChat !== null) {
        const GroupMessage = await msgChat[data.chatType].findOne({
          _id: groupChat.messages,
        });
        console.log('db msg groupChat ', GroupMessage);
        if (GroupMessage) {
          GroupMessage.messages.push(message);
          GroupMessage.save().then((r) => {
            next({ status: true, info: 'save', data: r });
          });
        } else {
          const GroupMessage = await new msgChat[data.chatType]({
            messages: [{ ...message }],
          });
          console.log('group message ', GroupMessage);
          GroupMessage.save().then(async (r) => {
            const groupChat = await new obj[data.chatType]({
              ...datas[data.chatType],
              messages: r._id,
            });
            console.log('groupChat ', groupChat);
            groupChat.save().then((r) => {
              console.log('result ', r);
              next({ status: true, info: 'save', data: r });
            });
          });
        }
      } else {
        const GroupMessage = await new msgChat[data.chatType]({
          messages: [{ ...message }],
        });
        console.log('group message ', GroupMessage);
        GroupMessage.save().then(async (r) => {
          const groupChat = await new obj[data.chatType]({
            ...datas[data.chatType],
            messages: r._id,
          });
          console.log('groupChat ', groupChat);
          groupChat.save().then((r) => {
            console.log('result ', r);
            next({ status: true, info: 'save', data: r });
          });
        });
      }
    });
  }

  static readGroupMessage(data) {
    console.log('data', data);
    return new Promise(async (next) => {
      let obj = {
        classroomChat: ClassroomChat,
        subjectChat: Subject,
        teacherChat: Teacher,
      };
      let datas = {
        classroomChat: {
          schoolId: data.schoolId,
          classroomId: data.classroomId,
        },
        subjectChat: {
          schoolId: data.schoolId,
          classroomId: data.classroomId,
          subjectId: data.subjectId,
        },
        teacherChat: {
          schoolId: data.schoolId,
          classroomId: data.classroomId,
        },
      };
      let msgChat = {
        classroomChat: GroupsMessages,
        subjectChat: SubjectsMessages,
        teacherChat: TeachersMessages,
      };
      const classroomChat = await obj[data.chatType].findOne(
        datas[data.chatType]
      );
      if (classroomChat !== null) {
        const GroupMessage = await msgChat[data.chatType].findOne({
          _id: classroomChat.messages,
        });
        if (GroupMessage !== null) {
          GroupMessage.messages.map((msg) =>
            msg.message_id === data.msg_id
              ? msg.readBy.push(data.userId)
              : (msg.readBy = msg.readBy)
          );
          GroupMessage.save().then((r) => next({ status: true, info: 'info' }));
        }
      }
    });
  }

  // Emojis

  static generatorEmojis(data) {
    return new Promise(async (next) => {
      let exist = await Emojis.find();
      if (exist.length == 0) {
        console.log('save loading');
        if (data.length > 0) {
          let emojis = new Emojis({ emojis: [...data] });
          emojis.save().then((r) => next({ status: true, info: 'emoji' }));
        }
      } else {
        next(null);
      }
    });
  }
};
