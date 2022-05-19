const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const purchases = require("./purchases.json");
const tickets = require("./tickets.json");
const fs = require("fs");

//load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(bodyParser.json());
app.use(cors());

// CONCURRENCY MIGHT BE AN ISSUE!!!!!!!!!!!!!! (MULTIPLE DEVICES SCANNING AT ONCE)

app.post("/", async (req, res) => {
  console.log("recieved");
  // App needs to manually input IP address
  let purchasesCopy = purchases;
  let purchasesUpdate = [];
  // Find purchase by ID
  const id = req.body.id;
  const found = purchasesCopy.find((element) => element._id.$oid === id);
  let isSuccess = null;
  let ticket = null;
  let error = "";
  let ticketFound = false;

  if (!purchasesCopy.length) {
    return res.send({
      data: "",
      result: "Empty JSON file",
      ticket: ticket,
      error: error,
      ticketFound: ticketFound,
    });
  }
  // create new list
  purchasesCopy.forEach((item, i) => {
    if (
      item._id.$oid === id &&
      item.status === "paid" &&
      item.checkedIn === false
    ) {
      ticket = tickets.find((ticket) => ticket._id.$oid === item.ticket.$oid);
      purchasesUpdate.push({
        _id: {
          $oid: item._id.$oid,
        },
        checkedIn: true,
        status: item.status,
        ticket: item.ticket.$oid,
        customerName: item.customerName,
        event: item.event,
      });
      ticketFound = true;
      isSuccess = true;
    } else if (item._id.$oid === id && item.checkedIn === true) {
      error = "Already checked in";
      purchasesUpdate.push(item);
    } else if (item._id.$oid === id && item.status !== "paid") {
      error = "Ticket not paid";
      purchasesUpdate.push(item);
    } else {
      purchasesUpdate.push(item);
    }

    if (i + 1 === purchasesCopy.length) {
      // write to file
      const jsonContent = JSON.stringify(purchasesUpdate);
      const time = Date.now();
      fs.writeFile("purchases.json", jsonContent, "utf8", function (err) {
        if (err) {
          return res.send({
            data: found ? found : "ticket not found",
            result: "Error writing JSON file",
            ticket: ticket,
            error: error,
            ticketFound: ticketFound,
          });
        }

        console.log("JSON file has been saved.");
      });
      fs.writeFile(
        `./backups/purchases-${time}.json`,
        jsonContent,
        "utf8",
        function (err) {
          if (err) {
            return res.send({
              data: found ? found : "ticket not found",
              result: "Error writing JSON file",
              ticket: ticket,
              error: error,
              ticketFound: ticketFound,
            });
          }

          console.log("JSON file has been saved.");
        }
      );
      // Give response
      return res.send({
        data: found ? found : "ticket not found",
        result: isSuccess,
        ticket: ticket,
        error: error,
        ticketFound: ticketFound,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
