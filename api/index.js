const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./queries");
const port = 3000;
const allowedOrigins = ["http://localhost:5173"];

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/members", db.getMembers);
app.get("/filter", db.queryMember);
app.get("/members/:id", db.getMemberById);
app.post("/members", db.createMember);
app.put("/members/:id", db.updateMember);
app.delete("/members/:id", db.deleteMember);
app.post('/dates/:id', db.checkinMember)

app.get("/dates", db.getDates);
app.get("/dates/:date", db.getDate);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
