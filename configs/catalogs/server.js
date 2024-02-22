const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const fs = require("fs");
/////////////////////////////////////////////
//========= CHECK UPTIME =========//
/////////////////////////////////////////////
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const logger = require("./system-settings/console/console-logger.js");
const chalk = require("chalk");
const port = process.env.PORT || 3000;
var uptimelink = [`https://papi-berwin-uwu.replit.app/ `];
const Monitor = require("ping-monitor");
for (const now of uptimelink) {
  const monitor = new Monitor({
    website: `${now}`,
    title: "█▀ █▀▀ █▀█ █░█ █▀▀ █▀█\n▄█ ██▄ █▀▄ ▀▄▀ ██▄ █▀▄",
    interval: 1,
    config: {
      intervalUnits: "minutes",
    },
  });
  monitor.on("up", (res) =>
    console.log(
      chalk.bold.hex("#00FF00")("[ UP ] ❯ ") +
        chalk.hex("#00FF00")(`${res.website}`),
    ),
  );
  monitor.on("down", (res) =>
    console.log(
      chalk.bold.hex("#FF0000")("[ DOWN ] ❯ ") +
        chalk.hex("#FF0000")(`${res.website} ${res.statusMessage}`),
    ),
  );
  monitor.on("stop", (website) =>
    console.log(
      chalk.bold.hex("#FF0000")("[ STOP ] ❯ ") +
        chalk.hex("#FF0000")(`${website}`),
    ),
  );
  monitor.on("error", (error) =>
    console.log(
      chalk.bold.hex("#FF0000")("[ ERROR ] ❯ ") +
        chalk.hex("#FF0000")(`${error}`),
    ),
  );
}

let botStartTime = Date.now();
const uptime = Date.now() - botStartTime;

function getFormattedDate() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

function logUptime() {
  const uptime = process.uptime();
  const formattedDate = getFormattedDate();
  const data = `${formattedDate} - Uptime: ${uptime.toFixed(2)} seconds\n`;

  fs.appendFile("uptime.json", data, (err) => {
    if (err) throw err;
    console.log("𝗨𝗣𝗧𝗜𝗠𝗘 𝗟𝗢𝗚𝗚𝗘𝗗.");

    const uptimeLimit = 24 * 60 * 60; // 24 hours in seconds
    if (uptime >= uptimeLimit) {
      console.log("24 hours uptime reached. Stopping logging.");
      clearInterval(intervalId);
    }
  });
}

const intervalId = setInterval(logUptime, 300000);

app.listen(port, () =>
  logger(`Your app is listening a http://localhost:${port}`, "[ ONLINE ]"),
);

logger("Opened server site...", "[ Starting ]");

function startBot(message) {
  message ? logger(message, "[ Starting ]") : "";

  const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "system.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    },
  );

  child.on("close", (codeExit) => {
    if (codeExit != 0 || (global.countRestart && global.countRestart < 5)) {
      startBot("Starting up...");
      global.countRestart += 1;
      return;
    } else return;
  });

  child.on("error", function (error) {
    logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
  });
}

startBot();

app.get("/dash", async (req, res) => {
  const uptime = Date.now() - botStartTime;
  res.json({
    uptime: uptime,
  });
});

app.get("/", (req, res) => res.sendFile(__dirname + "/html/website.html"));
