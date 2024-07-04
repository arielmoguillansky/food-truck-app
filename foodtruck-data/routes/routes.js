const express = require("express");
const router = express.Router();

const axios = require("axios");

router.get("/locations", (request, response) => {
  axios
    .get("https://data.sfgov.org/api/id/rqzj-sfat.json")
    .then((res) => {
      response.json(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
