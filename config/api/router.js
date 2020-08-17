const express = require("express");
let cheerio = require("cheerio"),
  request = require("request");

const router = new express.Router();

const { globalQueries } = require("./controller");
/**
 * USERS ROUTES
 *
 */

router.route("/createUser").post(async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let feedBack = await globalQueries.createUser(data);

    if (feedBack !== null) {
      res.json(feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});
/**
 * LOGIN ROUTE
 */
router.route("/loginUser").post(async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let feedBack = await globalQueries.loginUser(data);

    if (feedBack !== null) {
      res.json(feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});

router.route("/createClassroom").post(async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let feedBack = await globalQueries.createClassroom(data);
    if (feedBack !== null) {
      res.json(feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});

router.route("/allDataStudents").get(async (req, res) => {
  try {
    console.log("query ", req.query);
    let userId = parseInt(req.query.userId);
    let classroomId = parseInt(req.query.classroomId);
    let schoolId = parseInt(req.query.schoolId);
    let feedBack = await globalQueries.findAllData({
      userId,
      classroomId,
      schoolId,
      subjects: req.query.subjectsId.split(",").map((c) => parseInt(c)),
    });
    if (feedBack !== null) {
      res.json(feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});
router.route("/allDataTeachers").get(async (req, res) => {
  try {
    console.log("query ", req.query);
    let userId = parseInt(req.query.userId);
    let classroomId = parseInt(req.query.classroomId);
    let schoolId = parseInt(req.query.schoolId);
    let subjectId = parseInt(req.query.subjectId);
    let studentsIds = req.query.studentsIds.split(",").map((c) => parseInt(c));
    let feedBack = await globalQueries.findAllTeachersData({
      userId,
      classroomId,
      schoolId,
      subjectId,
      studentsIds,
    });
    if (feedBack !== null) {
      res.json(feedBack);
      console.log("feed", feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});
/**
 * MESSAGES ROUTES
 */
router.route("/getChatMessages").get(async (req, res) => {
  try {
    let userId = parseInt(req.query.userId);
    let peerId = parseInt(req.query.peerId);
    let feedBack = await globalQueries.findOneChatMessages({ userId, peerId });
    if (feedBack !== null) {
      res.json(feedBack);
    }
  } catch (err) {
    console.log("err", err);
  }
});

/****
 *
 * GENERATE EMOJI
 *
 */

router.route("/generateEmoji").get((req, res) => {
  try {
    console.log("start to scrapped...");
    request(
      {
        method: "GET",
        url: "https://www.w3schools.com/charsets/ref_emoji.asp",
      },
      async (err, rs, body) => {
        if (err) return console.log("Erreur ", err);
        let emojis = [];
        let $ = cheerio.load(body);

        let html_emojis = $("tr td:nth-child(2)");

        for (let i = 0; i < html_emojis.length; i++) {
          emojis.push(html_emojis[i].firstChild.data);
        }
        let feedback = await globalQueries.generatorEmojis(emojis);
        if (feedback != null) {
          res.json(feedback);
        }
        res.json({ status: false, info: "base existe deja" });
      }
    );
  } catch (err) {
    console.log("err", err);
  }
});
module.exports = router;
