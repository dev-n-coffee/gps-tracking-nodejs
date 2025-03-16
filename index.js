// (A) LOAD MODULES & SETTINGS
const sqlite3 = require("sqlite3"),
      path = require("path"),
      express = require("express"),
      port = 8888,
      multer = require("multer"),
      bodyParser = require("body-parser"),
      cors = require("cors");

// (B) CONNECT TO DATABASE
const db = new sqlite3.Database(
  path.join(__dirname, "/gps.db"),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      console.log("Connected to the gps database.");
    }
  }
);

// (C) INIT EXPRESS SERVER
const app = express();
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // this is bad - allows all
// app.use(cors({ origin: ["https://site.com", "https://my-site.com"] }));

// (D1) ROUTES/ENDPOINTS
// (D1) UPDATE GPS POSITION OF USER
app.post("/set", (req, res) => {
  db.run(
    "REPLACE INTO movement (id, lng, lat) VALUES (?, ?, ?)",
    [req.body.id, req.body.lng, req.body.lat],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "ok" });
      }
    }
  );
});

// (D2) GET GPS POSITION OF ALL USERS
app.get("/get", (req, res) => {
  db.all("SELECT * FROM movement", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        message: "ok",
        data: rows
      });
    }
  });
});

// (D3) DUMMY TRACKING PAGE
app.get("/track", (req, res) => {
  res.sendFile(path.join(__dirname, "/track.html"));
});

// (D4) DUMMY ADMIN PAGE
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "/admin.html"));
});

// (E) START EXPRESS SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});