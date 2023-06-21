const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./queries");
const port = 3000;
const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
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

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/customers", db.getCustomers);
app.get("/filter", db.queryCustomer);
app.get("/customers/:id", db.getCustomerById);
app.post("/customers", db.createCustomer);
app.put("/customers/:id", db.updateCustomer);
app.delete("/customers/:id", db.deleteCustomer);
app.post("/dates/:id", db.checkinCustomer);

app.get("/dates", db.getDates);
app.get("/dates/:date", db.getDate);

app.get("/couples", db.getCouples);
app.get("/couples/:id", db.getCustomerCouple);
app.post("/couples", db.createCouple);
app.post("/couples/delete", db.deleteCouple);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
