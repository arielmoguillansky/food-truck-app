const express = require("express");
const routes = require("./routes/routes");
const app = express();
const port = 5000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
