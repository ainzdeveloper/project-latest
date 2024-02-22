const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const axios = require('axios')
const config = require("../../config.json");
const chalk = require("chalk");
const listPackage = JSON.parse(readFileSync('../../package.json')).dependencies;
const packages = JSON.parse(readFileSync('../../package.json'));
const fs = require("fs");
const login = require('../../orion/fca-project-orion');
const moment = require("moment-timezone");
const logger = require("./system-settings/console/console-logger.js");
const gradient = require("gradient-string");
const process = require("process");
const listbuiltinModules = require("module").builtinModules;
const cnslEvent = require("./system-settings/configs/console.json");

global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  configurationsPath: new String(),
  premiumListsPath: new String(),
  approvedListsPath: new String(),
  getTime: function(option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Manila").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Manila").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Manila").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Manila").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Manila").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Manila").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now()
});
global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array(),
});
global.utils = require("./utils.js");
global.loading = require("./system-settings/console/console-logger.js");
global.nodemodule = new Object();
global.config = new Object();
global.configurations = new Object();
global.premium = new Object();
global.approved = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

const cheerful = gradient.fruit
const crayon = gradient('yellow', 'lime', 'green');
const sky = gradient('#3446eb', '#3455eb', '#3474eb');
const BLUE = ('#3467eb');
const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("commands with errors : ");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}

var configurationsValue;
try {
  global.client.configurationsPath = join(global.client.mainPath, "../../configurations.json");
  configurationsValue = require(global.client.configurationsPath);
} catch (e) {
  return;
}
try {
  for (const Keys in configurationsValue) global.configurations[Keys] = configurationsValue[Keys];
} catch (e) {
  return;
}
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "../../config.json");
  configValue = require(global.client.configPath);
  logger.loader(`deploying ${chalk.blueBright('config.json')} file`);
} catch (e) {
  return logger.loader(`cant read ${chalk.blueBright('config.json')} file`, "error");
}
try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader(`deployed ${chalk.blueBright('config.json')} file`);
} catch (e) {
  return logger.loader(`can't deploy ${chalk.blueBright('config.json')} file`, "error")
}

var approvedListsValue;
try {
  global.client.approvedListsPath = join(global.client.mainPath, "../data/ApprovedLists.json");
  approvedListsValue = require(global.client.approvedListsPath);
  if (config.approval) {
  logger.loader(`deploying ${chalk.blueBright(`approved database`)}`);
  } else {
    logger(`${chalk.blueBright(`approval`)} system is turned off`, 'warn');
  }
} catch (e) {
  return logger(`can't read approved database`, 'error');
}
try {
  for (const approvedListsKeys in approvedListsValue) global.approved[approvedListsKeys] = approvedListsValue[approvedListsKeys];
  if (config.approval) {
    logger.loader(`deployed ${chalk.blueBright(`approved database`)}`)
  }
} catch (e) {
  return logger(`can't deploy approved groups database`, 'error')
}


const { Sequelize, sequelize } = require("../system/database/index.js");
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property)
  } catch (e) { }
}
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
  encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
  const getSeparator = item.indexOf('=');
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, '\n');
  if (typeof global.language[head] == "undefined") global.language[head] = new Object();
  global.language[head][key] = value;
}
global.getText = function(...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - not found key language : ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - not found key text : ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  if (!global.config.BOTNAME) {
    logger.error(`please enter your bot name in ${chalk.blueBright('config.json')} file`);
    process.exit(0);
  }
  if (!global.config.PREFIX) {
    logger.error(`please enter your bot prefix in ${chalk.blueBright('config.json')} file`)
  }
  if (global.config.author != "Ainz") {
    logger.error(`detected : author was changed at ${chalk.blueBright('config.json')}`);
    process.exit(0);
  }
  if (packages.author != "Ainz") {
    logger.error(`detected : author was changed at ${chalk.blueBright('package.json')}`);
    process.exit(0);
  }
  if (packages.name != "Ainz") {
    logger.error(`detected : project name was changed at ${chalk.blueBright('package.json')}`);
    process.exit(0);
  }
} catch (error) {
  return;
}

try {
  var appStateFile = resolve(join(global.client.mainPath, "../../facebookstate.json"));
  var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && ryuko.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
  logger.loader(`deployed ${chalk.blueBright('facebookstate')} file`)
} catch (e) {
  return logger.error(`can't read ${chalk.blueBright('facebookstate')} file`)
}

function onBot({ models: botModel }) {
  const loginData = {};
  loginData.appState = appState;
  login(loginData, async (err, api) => {
    if (err) {
        console.log(err)
        return process.exit(0)
      }
    api.setOptions(global.configurations.configurations);
    const fbstate = api.getAppState();
    let d = api.getAppState();
    d = JSON.stringify(d, null, '\x09');
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.configurations.encryptSt) {
      d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, d)
    } else {
      writeFileSync(appStateFile, d)
    }
    global.client.api = api
    global.configurations.version = config.version,
      (async () => {
        const commandsPath = `../../mods/cmds`;
        const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
  console.clear();
  console.log(gradient.instagram(`\n` + `𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 𝙴𝙽𝙲𝚁𝚈𝙿𝚃𝙴𝙳 𝚃𝙷𝙴 𝙰𝙿𝙿𝚂𝚃𝙰𝚃𝙴.`));
          console.clear();
console.log(gradient.instagram(`\n` + `𝙸𝙽𝚂𝚃𝙰𝙻𝙻𝙸𝙽𝙶 𝙵𝙴𝙰𝚃𝚄𝚁𝙴𝚂 - 𝙺𝚈𝙾𝚄𝚈𝙰 𝙿𝚁𝙾𝙹𝙴𝙲𝚃 𝟸𝟶𝟸𝟺`));
console.log(gradient.instagram(`\n` + `𝙸𝙼𝙿𝙾𝚁𝚃𝙸𝙽𝙶 𝙰𝙻𝙻 𝚃𝙷𝙴 𝙽𝙴𝙴𝙳 𝙾𝙽 𝚃𝙷𝙸𝚂 𝚂𝚈𝚂𝚃𝙴𝙼, 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃. . .`));
console.log(gradient.instagram(`\n` + `𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃. . .\n`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.commandCategory) {
              try {
                throw new Error(`[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ] : ${command} category is not in the correct format or empty`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }
            if (!config?.hasOwnProperty('usePrefix')) {
              console.log(`[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ]`, chalk.hex("#ff0000")(command) + ` does not have the "prefix" property.`);
              continue;
            }

            if (global.client.commands.has(config.name || '')) {
              console.log(chalk.red(`[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ] : ${chalk.hex("#FFFF00")(command)} module is already deployed.`));
              continue;
            }
            const { dependencies, envConfig } = config;
            if (dependencies) {
              Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                if (listPackage[reqDependency]) return;
                try {
                  execSync(`npm install --save ${reqDependency}${dependencyVersion ? `@${dependencyVersion}` : ''}`, {
                    stdio: 'inherit',
                    env: process.env,
                    shell: true,
                    cwd: join('../../node_modules')
                  });
                  require.cache = {};
                } catch (error) {
                  const errorMessage = `failed to install package ${reqDependency}\n`;
                  global.loading.err(chalk.hex('#ff7100')(errorMessage), '[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ]');
                }
              });
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] = global.configModule[moduleName] || {};
              global.configurations[moduleName] = global.configurations[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] = global.configurations[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                global.configurations[moduleName][envConfigKey] = global.configurations[moduleName][envConfigKey] ?? envConfig[envConfigKey];
              }
              var configurationsPath = require('../../configurations.json');
              configurationsPath[moduleName] = envConfig;
              writeFileSync(global.client.configurationsPath, JSON.stringify(configurationsPath, null, 4), 'utf-8');
            }


            if (module.onLoad) {
              const moduleData = {};
              moduleData.api = api;
              moduleData.models = botModel;
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage = "unable to load the onLoad function of the module."
                throw new Error(errorMessage, '[ 𝙴𝚁𝚁𝙾𝚁 ]');
              }
            }

            if (module.handleEvent) global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading(`${crayon(``)}successfully deployed ${chalk.blueBright(config.name)}`, `[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ]`);
            } catch (err) {
              console.error("an error occurred while deploying the command : ", err);
            }

            console.err
          } catch (error) {
            global.loading.err(`${chalk.hex('#ff7100')(``)}failed to deploy ${chalk.hex("#FFFF00")(command)} ` + error + '\n', "[ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ]");
          }
        }
      })(),

      (async () => {
        const events = readdirSync(join(global.client.mainPath, '../../mods/events')).filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));
        console.log(gradient.instagram(`\𝚗` + `𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 𝙳𝙴𝙿𝙻𝙾𝚈𝙴𝙳 𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂.\𝚗`));

            console.log(gradient.instagram(`\n` + `𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙴𝚅𝙴𝙽𝚃𝚂 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃. . .\n`));
        for (const ev of events) {
          try {
            const event = require(join(global.client.mainPath, '../../mods/events', ev));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is not in the correct format. `, "[ 𝙴𝚅𝙴𝙽𝚃 ]");
              continue;
            }


            if (errorMessages.length > 0) {
              console.log("commands with errors :");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is already deployed.`, "[ 𝙴𝚅𝙴𝙽𝚃 ]");
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
              if (missingDeps.length) {
                const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                  stdio: 'inherit',
                  env: process.env,
                  shell: true,
                  cwd: join('../../node_modules')
                });
                Object.keys(require.cache).forEach(key => delete require.cache[key]);
              }
            }
            if (config.envConfig) {
              const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
              const configData = global.configurations[config.name] || (global.configurations[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] = config.envConfig[evt] || '';
              }
              writeFileSync(global.client.configurationsPath, JSON.stringify({
                ...require(global.client.configurationsPath),
                [config.name]: config.envConfig
              }, null, 2));
            }
            if (onLoad) {
              const eventData = {};
              eventData.api = api, eventData.models = botModel;
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading(`${crayon(``)}successfully deployed ${chalk.blueBright(config.name)}`, "[ 𝙴𝚅𝙴𝙽𝚃 ]");
          }
          catch (err) {
            global.loading.err(`${chalk.hex("#ff0000")('')}${chalk.blueBright(ev)} failed with error : ${err.message}` + `\n`, "[ 𝙴𝚅𝙴𝙽𝚃 ]");
          }
        }
      })();
          console.log(gradient.instagram(`\n` + `𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈 𝙳𝙴𝙿𝙻𝙾𝚈𝙴𝙳 𝙰𝙻𝙻 𝙴𝚅𝙴𝙽𝚃𝚂.\n`));

        console.log(gradient.instagram(`\n` + `𝚂𝚃𝙰𝚁𝚃𝙸𝙽𝙶 𝙱𝙾𝚃 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃. . .\n`));
        global.loading(`${crayon(``)}loaded ${chalk.blueBright(`${global.client.commands.size}`)} commands and ${chalk.blueBright(`${global.client.events.size}`)} events`, "[ 𝙻𝙾𝙰𝙳𝙴𝚁 ] •");
        global.loading(`${crayon(``)}launch time : ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`, "[ 𝙻𝙾𝙰𝙳𝙴𝚁 ] •");        
      const { getTime } = global.client;
      const time = getTime('fullTime');
      const activationMessage = `🟢 | This bot is activated at time ${time}`; 
    api.sendMessage(activationMessage, global.config.ADMINBOT);
      console.log(gradient.instagram(`AINZ-PACK SUCCESSFULLY LAUNCHED!!`));
                    console.log(gradient.instagram('[ OK | TIKTOK DOWNLOAD AUTO ]'));

      console.log(gradient.instagram('[ OK | GOOGLE DRIVE AUTO DOWNLOAD ]'));

      console.log(gradient.instagram('[ OK | YOUTUBE DOWNLOAD AUTO ]'));

      console.log(gradient.instagram('[ OK | FACEBOOK DOWNLOAD AUTO ]'));

      console.log(gradient.instagram('[ MODERTE  | AUTO REACT ]'));

      console.log(gradient.instagram(`[ THIS BOT MADE BY AINZ DEVELOPER ]`));
        
      console.log(gradient.instagram('▄▀█ █ █▄░█ ▀█\n█▀█ █ █░▀█ █▄'));
      const path = require('path');
      const autoGreetPath = path.join(__dirname, 'kyouya.js');
      const autoGreet = require(autoGreetPath);
      const listenerData = {};
            listenerData.api = api; 
        listenerData.models = botModel;
      const listener = require('../system/listen.js')(listenerData);
        global.custom = require('./kyouya.js')({ api: api });
        global.handleListen = api.listenMqtt(async (error, event) => {

    //━━━━━━━━━━━━━━━━━━//
      if (event.body !== null) {
          const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
          const link = event.body;
          if (regEx_tiktok.test(link)) {
            api.setMessageReaction("📥", event.messageID, () => { }, true);
            axios.post(`https://www.tikwm.com/api/`, {
              url: link
            }).then(async response => { // Added async keyword
              const data = response.data.data;
              const videoStream = await axios({
                method: 'get',
                url: data.play,
                responseType: 'stream'
              }).then(res => res.data);
              const fileName = `TikTok-${Date.now()}.mp4`;
              const filePath = `./${fileName}`;
              const videoFile = fs.createWriteStream(filePath);

              videoStream.pipe(videoFile);

              videoFile.on('finish', () => {
                videoFile.close(() => {
                  console.log('Downloaded video file.');

                  api.sendMessage({
                    body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\n𝗔𝗜𝗡𝗭 𝗕𝗢𝗧 𝟭.𝟱.𝟭𝘃`,
                    attachment: fs.createReadStream(filePath)
                  }, event.threadID, () => {
                    fs.unlinkSync(filePath);  // Delete the video file after sending it
                  });
                });
              });
            }).catch(error => {
              api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, event.threadID, event.messageID);
            });
          }
          //*Auto Download Google Drive here By Jonell Magallanes//*
        }
        if (event.body !== null) {
          (async () => {
            const fs = require('fs');
            const { google } = require('googleapis');
            const mime = require('mime-types');
            const path = require('path');

            const apiKey = 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI'; // Your API key
            if (!apiKey) {
              console.error('No Google Drive API key provided.');
              return;
            }

            const drive = google.drive({ version: 'v3', auth: apiKey });

            // Regex pattern to detect Google Drive links in messages
            const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive.google.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
            let match;

            // Specify the directory to save files
            const downloadDirectory = path.join(__dirname, 'downloads');


            while ((match = gdriveLinkPattern.exec(event.body)) !== null) {
              // Extract fileId from Google Drive link
              const fileId = match[1];

              try {
                const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
                const fileName = res.data.name;
                const mimeType = res.data.mimeType;

                const extension = mime.extension(mimeType);
                const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
                const destPath = path.join(downloadDirectory, destFilename);

                console.log(`Downloading file "${fileName}"...`);

                const dest = fs.createWriteStream(destPath);
                let progress = 0;

                const resMedia = await drive.files.get(
                  { fileId: fileId, alt: 'media' },
                  { responseType: 'stream' }
                );

                await new Promise((resolve, reject) => {
                  resMedia.data
                    .on('end', () => {
                      console.log(`Downloaded file "${fileName}"`);
                      resolve();
                    })
                    .on('error', (err) => {
                      console.error('Error downloading file:', err);
                      reject(err);
                    })
                    .on('data', (d) => {
                      progress += d.length;
                      process.stdout.write(`Downloaded ${progress} bytes\r`);
                    })
                    .pipe(dest);
                });

                console.log(`Sending message with file "${fileName}"...`);
                // Use the fs.promises version for file reading
                await api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖽𝗈𝗐𝗇 𝖦𝗈𝗈𝗀𝗅𝖾 𝖣𝗋𝗂𝗏𝖾 𝖫𝗂𝗇𝗄 \n\n𝙵𝙸𝙻𝙴𝙽𝙰𝙼𝙴: ${fileName}\n\n𝗔𝗜𝗡𝗭 𝗕𝗢𝗧 𝟭.𝟱.𝟭𝘃`, attachment: fs.createReadStream(destPath) }, event.threadID);

                console.log(`Deleting file "${fileName}"...`);
                await fs.promises.unlink(destPath);
                console.log(`Deleted file "${fileName}"`);
              } catch (err) {
                console.error('Error processing file:', err);
              }
            }
          })();
        }

        //* autoseen here
        // Check the autoseen setting from config and apply accordingly
        if (event.body !== null) {
          api.markAsReadAll(() => { });
        }
        //*youtube auto down here
        if (event.body !== null) {
          const ytdl = require('ytdl-core');
          const fs = require('fs');
          const path = require('path');
          const simpleYT = require('simple-youtube-api');

          const youtube = new simpleYT('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

          const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

          const videoUrl = event.body;

          if (youtubeLinkPattern.test(videoUrl)) {
            youtube.getVideo(videoUrl)
              .then(video => {
                const stream = ytdl(videoUrl, { quality: 'highest' });


                const filePath = path.join(__dirname, `./downloads/${video.title}.mp4`);
                const file = fs.createWriteStream(filePath);


                stream.pipe(file);

                file.on('finish', () => {
                  file.close(() => {
                    api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 \n\n𝗔𝗜𝗡𝗭 𝗕𝗢𝗧 𝟭.𝟱.𝟭𝘃`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
                  });
                });
              })
              .catch(error => {
                console.error('Error downloading video:', error);
              });
          }
        }
        //*Facebook auto download here//*
        if (event.body !== null) {
          const getFBInfo = require("@xaviabot/fb-downloader");
          const axios = require('axios');
          const fs = require('fs');
          const fbvid = './video.mp4'; // Path to save the downloaded video
          const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

          const downloadAndSendFBContent = async (url) => {
            try {
              const result = await getFBInfo(url);
              let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
              fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
              return api.sendMessage({ body: "𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈\n\n𝗔𝗜𝗡𝗭 𝗕𝗢𝗧 𝟭.𝟱.𝟭𝘃", attachment: fs.createReadStream(fbvid) }, event.threadID, () => fs.unlinkSync(fbvid));
            }
            catch (e) {
              return console.log(e);
            }
          };

          if (facebookLinkRegex.test(event.body)) {
            downloadAndSendFBContent(event.body);
          }
        }
        if (event.body !== null && event.body === `${global.config.PREFIX}unsend`) {
          if (!event.messageReply || event.type !== "message_reply" || event.messageReply.senderID != api.getCurrentUserID()) {
            return api.sendMessage("Can't unsend message.", event.threadID, event.messageID);
          }
          return api.unsendMessage(event.messageReply.messageID);
        }
        //shoti cron

        if (event.body !== null) {
          if (event.isNickname && event.isNicknameFrom && event.senderID === botUserID) {
            api.changeNickname(`${global.config.BOTNAME} • [${global.config.PREFIX}]`, event.threadID);
            api.sendMessage("Changing the bot's nickname is not allowed in this group chat.", event.threadID);
          }
        }

        if (event.body !== null) {
          if (event.body === "bot") {
            const responses = [
              "Hello there!",
              "Greetings, how can I assist you?",
              "Hey, what's up?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return api.sendMessage(randomResponse, event.threadID, event.messageID);
            // send the random response
          }
          if (event.body === `${global.config.BOTNAME}`) {
            const responses = [
              "Hello there!",
              "Greetings, how can I assist you?",
              "Hey, what's up?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return api.sendMessage(randomResponse, event.threadID, event.messageID);
          }
          if (event.body === "Bot") {
            const responses = [
              "Hello there!",
              "Greetings, how can I assist you?",
              "Hey, what's up?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return api.sendMessage(randomResponse, event.threadID, event.messageID);
          }
          if (event.body === `@${global.config.BOTNAME}`) {
            const responses = [
              "Hello there!",
              "Greetings, how can I assist you?",
              "Hey, what's up?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return api.sendMessage(randomResponse, event.threadID, event.messageID);

          }
        }
       /* const chalk = require('chalk')
        //*if (event.body !== null) {
        var time = moment.tz("Asia/Manila").format("LLLL");
         if (event.senderID === api.getCurrentUserID()) return;
        const threadID = event.threadID;
        const body = event.body;
        const threadInfo = await api.getThreadInfo(event.threadID);

        const gradientText = (text) => gradient('cyan', 'pink')(text);
        const boldText = (text) => chalk.bold(text);
        console.log(gradientText("━━━━━━━━━━[ DATABASE THREADS BOT LOGS ]━━━━━━━━━━"));
        console.log(gradientText("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
        console.log(`${boldText(gradientText(`┣➤ Group: ${threadInfo}`))}`);
        console.log(`${boldText(gradientText(`┣➤ Group ID: ${threadID}`))}`);
        console.log(`${boldText(gradientText(`┣➤ User ID: ${senderID}`))}`);
      console.log(`${boldText(gradientText(`┣➤ Content: ${body || "N/A"}`))}`);
        console.log(`${boldText(gradientText(`┣➤ Time: ${time}`))}`);
        console.log(gradientText("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));
        }*/
        if (event.body !== null) {
          const pastebinLinkRegex = /https:\/\/pastebin\.com\/raw\/[\w+]/;
          if (pastebinLinkRegex.test(event.body)) {
            api.getThreadInfo(event.threadID, (err, info) => {
              if (err) {
                console.error('Failed to get thread info:', err);
                return;
              }
              const threadName = info.threadName;
              api.sendMessage({
                body: `📜 | 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 𝗢𝗡\n\n𝖳𝗁𝗋𝖾𝖺𝖽: ${threadName}\nUser: ${event.senderID}\n\n𝖫𝗂𝗇𝗄:\n\n${event.body}`,
                url: event.body
              }, global.config.PREFIX);
            });
          }
        }
   //━━━━━━━━━━━━━━━━━━━━// 
      if (error) {
        logger.error(error);
        return process.exit(0);
      }
      if (['presence', 'typ', 'read_receipt'].some(data => data === event.type)) return;
      return listener(event);
    });
  });
}
(async () => {
  try {
    await sequelize.authenticate();
    const authentication = {};
    const chalk = require('chalk');
    authentication.Sequelize = Sequelize;
    authentication.sequelize = sequelize;
    const models = require('../system/database/model.js')(authentication);
    logger(`deployed ${chalk.blueBright('database')} system`, "[ 𝙳𝙰𝚃𝙰𝙱𝙰𝚂𝙴 ]");
    logger(`deploying ${chalk.blueBright('login')} system`, "[ 𝚂𝚈𝚂𝚃𝙴𝙼 ]")
    const botData = {};
    botData.models = models;
    onBot(botData);
  } catch (error) { logger(`can't deploy ${chalk.blueBright('database')} system`, "[ 𝙳𝙰𝚃𝙰𝙱𝙰𝚂𝙴 ]") }
})();