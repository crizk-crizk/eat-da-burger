const express = require("express");

const router = express.Router();

// Import the model (burger.js) to use its database functions.
const burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
//get user input
router.get("/", (req, res) => {
  burger.all((data) => {
    const hbsObject = {
      burgers: data,
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });

  // create burger route - add to page
  router.post("/api/burgers", (req, res) => {
    burger.create(
      ["burger_name", "devoured"],
      [req.body.burger_name, req.body.devoured],
      (result) => {
        // Send back the ID of the new quote
        res.json({ id: result.insertId });
      }
    );
  });

  //update
  router.put("/api/burgers/:id", (req, res) => {
    const condition = `id = ${req.params.id}`;

    console.log("condition", condition);

    burger.update(
      {
        devoured: req.body.devoured,
      },
      condition,
      (result) => {
        if (result.changedRows == 0) {
          // If no rows were changed, then the ID must not exist, so 404
          return res.status(404).end();
        }
        res.status(200).end();
      }
    );
  });

  //DELETE ROUTE
  router.delete("/api/burgers/:id", (req, res) => {
    const condition = `id = ${req.params.id}`;

    console.log("condition:", condition);

    burger.delete(condition, (result) => {
      console.log(result);
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
    });
  });
});

// Export routes for server.js to use.
module.exports = router;
