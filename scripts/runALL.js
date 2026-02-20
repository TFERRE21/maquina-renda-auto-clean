import { execSync } from "child_process";
import path from "path";

const output = path.resolve("output/thumb.jpg");

execSync(`
ffmpeg -y -f lavfi -i color=c=black:s=1280x720 \
-vf "drawtext=text='INVESTIMENTOS HOJE':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2" \
-frames:v 1 ${output}
`);

console.log("✅ Thumbnail criada!");
