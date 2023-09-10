const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const app = express();
const db = require("./queries");
const path = require("path");
const port = 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:8000",
  "http://localhost:3000",
];

app.disable("etag");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(favicon(path.join(__dirname, "public", "cupid.ico")));

app.use(bodyParser.json({ limit: "100mb" }));

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

app.use(express.static(path.join(__dirname, "dist")));

// Build files and move them to the AI folder before running this :)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

db.updateMemebership()

setInterval(() => {
  db.updateMemebership()
}, 60*60*6*1000);

app.get("/customers", db.getCustomers);
app.get("/customers/names", db.queryCustomer);
app.get("/customers/:id", db.getCustomerById);
app.get("/maxid", db.getMaxId);
app.post("/customers", db.createCustomer);
app.put("/customers/:id", db.updateCustomer);
app.delete("/customers/:id", db.deleteCustomer);
app.delete("/customers/:id/ban", db.banCustomer);
app.delete("/customers/:id/unban", db.unbanCustomer);
app.post("/dates/:id", db.checkinCustomer);

app.get("/dates", db.getDates);
app.get("/dates/:date", db.getDate);

app.get("/couples", db.getCouples);
app.get("/couples/:id", db.getCustomerCouple);
app.post("/couples", db.createCouple);
app.post("/couples/delete", db.deleteCouple);

app.get('/stats', db.getStats);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
