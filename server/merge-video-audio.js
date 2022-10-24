
import ffmpegPath from'ffmpeg-static';
import cp from'child_process';
import stream from'stream';
import { createReadStream } from 'fs'


function mergeVideoAudio(file_video, file_audio) {
    const config = { highWaterMark: 1024 * 512 };
    
    const result = new stream.PassThrough(config);

    let audioStream = createReadStream(file_video, config)
    let videoStream = createReadStream(file_audio, config)

    // create the ffmpeg process for merge
    //ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4

    let ffmpegProcess = cp.spawn(ffmpegPath, [
        // supress non-crucial messages
        '-loglevel', '8', '-hide_banner',
        // input audio and video by pipe
        '-i', 'pipe:3', '-i', 'pipe:4',
        // no need to change the codec
        '-c', 'copy',
        // output mp4 and pipe
        '-f', 'matroska', 'pipe:5'
    ], {
        // no popup window for Windows users
        windowsHide: true,
        stdio: [
            // silence stdin/out, forward stderr,
            'inherit', 'inherit', 'inherit',
            // and pipe audio, video, output
            'pipe', 'pipe', 'pipe'
        ]
    });

    audioStream.pipe(ffmpegProcess.stdio[3]);
    videoStream.pipe(ffmpegProcess.stdio[4]);

    ffmpegProcess.stdio[5].pipe(result);

    return result;
};

// export it
export default mergeVideoAudio;


// const url = 'http://localhost:3000';

// async function consume() {
//     const response = await axios({
//         url,
//         method: 'get',
//         responseType: 'stream'
//     })
//     return response.data;
// }

// const stream = await consume();


