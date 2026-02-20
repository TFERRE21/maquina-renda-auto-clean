import { execSync } from "child_process";

execSync("node scripts/generateScript.js", { stdio: "inherit" });
execSync("node scripts/generateImages.js", { stdio: "inherit" });
execSync("node scripts/generateVoice.js", { stdio: "inherit" });
execSync("node scripts/generateLong.js", { stdio: "inherit" });
execSync("node scripts/uploadYoutube.js", { stdio: "inherit" });