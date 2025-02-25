
// import qc module
import {readYML, makeSchedule, makeThisWeek, makeAdaptiveNav, ignoreFiles, runQuartoRender} from "./qc-functions.ts"

// set parameters
const configPath = '_config.yml';
const tempFilesDir = '';
const renderType = Deno.args[0];

// check for argument
if (renderType !== "partial-site" && renderType !== "full-site") {
    console.error("Error: The first argument must be 'partial-site' or 'full-site'.");
    Deno.exit(1);
}

// load _config.yml
const config = await readYML(configPath);

// pre-pre render steps
console.log("> Beginning ", renderType, " render.")
const schedule = await makeSchedule(config, tempFilesDir, renderType);
await makeThisWeek(config, schedule, tempFilesDir)
await makeAdaptiveNav(config, schedule, tempFilesDir);
if (renderType == "partial-site") {
  await ignoreFiles(schedule);
}

// run quarto render (which itself has pre- and post-render steps)
await runQuartoRender(renderType);

