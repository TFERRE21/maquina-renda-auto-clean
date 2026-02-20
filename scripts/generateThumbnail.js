import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const type = process.argv[2] || "long";

const metadata = JSON.parse(
  fs.readFileSync(`output/metadata_${type}.json`)
);

const title = metadata.title.slice(0, 40);

execSync(`
ffmpeg -y -i output/images/img_1.png \
-vf "scale=1280:720,drawtext=text='${title}':fontcolor=white:fontsize=70:borderw=5:bordercolor=black:x=(w-text_w)/2:y=h-250" \
output/thumb_${type}.jpg
`, { stdio: "inherit" });

console.log("✅ Thumbnail pronta!");
