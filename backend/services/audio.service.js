import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import axios from "axios";
import stream from "stream";

ffmpeg.setFfmpegPath(ffmpegPath);

export const normalizeFromUrl = async (audioUrl) => {
    const response = await axios.get(audioUrl, {
        responseType: "stream"
    });

    const outputStream = new stream.PassThrough();
    const chunks = [];

    outputStream.on("data", chunk => chunks.push(chunk));

    return new Promise((resolve, reject) => {
        ffmpeg(response.data)
        .audioChannels(1)
        .audioFrequency(16000)
        .audioCodec("pcm_s16le")
        .format("wav")
        .on("error", reject)
        .on("end", () => {
            resolve(Buffer.concat(chunks));
        })
        .pipe(outputStream);
    });
};