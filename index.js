// // const { create } = require("youtube-dl-exec");
// // const path = require("path");

// // // Resolve the path to the yt-dlp binary
// // const binaryPath = path.resolve(
// //   __dirname,
// //   "node_modules",
// //   "youtube-dl-exec",
// //   "bin",
// //   "yt-dlp.exe"
// // );

// // // Create a youtubedl instance with the specified binary path
// // const youtubedl = create(binaryPath);

// // youtubedl("https://www.youtube.com/watch?v=Gb5gm6ztt80", {
// //   dumpSingleJson: true,
// //   noCheckCertificates: true,
// //   noWarnings: true,
// //   preferFreeFormats: true,
// //   addHeader: ["referer:youtube.com", "user-agent:googlebot"],
// // })
// //   .then((output) => console.log(output))
// //   .catch((err) => console.error(err));

// const fs = require("fs");
// const { exec } = require("youtube-dl-exec");

// const videoUrl = "https://www.youtube.com/watch?v=Gb5gm6ztt80";

// const outputPath = "audio.mp3";

// const outputStream = fs.createWriteStream(outputPath);

// const subprocess = exec(videoUrl, {
//   output: "-",
//   format: "worstaudio",
//   extractAudio: true,
//   audioFormat: "mp3",
//   noCheckCertificates: true,
//   noWarnings: true,
//   preferFreeFormats: true,
//   addHeader: ["referer:youtube.com", "user-agent:googlebot"],
// });

// subprocess.stdout.pipe(outputStream);

const urlMetadata = require("url-metadata");

(async () => {
  try {
    const links = [
      "https://www.summarizer.org/",
      "https://quillbot.com/summarize",
      "https://www.grammarly.com/ai/ai-writing-tools/summarizing-tool",
      "https://decopy.ai/summarizer/",
      "https://smallpdf.com/pdf-summarizer",
    ];

    for (const url of links) {
      try {
        const metadata = await urlMetadata(url);
        console.log(`Metadata for ${url}:`);
        console.log("title", metadata?.title);
        console.log("description", metadata?.description);
        console.log("og:title", metadata?.["og:title"]);
        console.log("og:description", metadata?.["og:description"]);
        console.log("--------------------------------------------------");
      } catch (err) {
        console.error(`Error fetching metadata for ${url}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
})();
