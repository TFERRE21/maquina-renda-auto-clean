import { execSync } from "child_process";

console.log("☀️ EXECUÇÃO MANHÃ 09H");

execSync("node scripts/generateScript.js long", { stdio: "inherit" });
execSync("node scripts/generateMetadata.js long", { stdio: "inherit" });

execSync("node scripts/generateScript.js short", { stdio: "inherit" });
execSync("node scripts/generateMetadata.js short", { stdio: "inherit" });

execSync("node scripts/generateImages.js", { stdio: "inherit" });
execSync("node scripts/generateAudio.js", { stdio: "inherit" });
execSync("node scripts/generateVideo.js", { stdio: "inherit" });
execSync("node scripts/uploadYoutube.js", { stdio: "inherit" });

console.log("✅ MANHÃ FINALIZADA");