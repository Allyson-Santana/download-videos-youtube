/*/ //////////////////////////////////////////////////////////////////
\*\ ytdl-core-muxer: mostly copied from the ytdl-core example code :) 
\*\ credit and thanks for those authors: fent, TimeForANinja, coolaj86
/*/ //////////////////////////////////////////////////////////////////

// require all the things!
import ytdl from'ytdl-core';
import ffmpegPath from'ffmpeg-static';
import cp from'child_process';
import stream from'stream';

// default export: the ffmpeg muxer
function ytmux(request, link, options = {}) {
    const result = new stream.PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });
    ytdl.getInfo(link, options).then(info => {
        let audioStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestaudio' });
        let videoStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestvideo' });
        // create the ffmpeg process for muxing
        let ffmpegProcess = cp.spawn(ffmpegPath, [
            // supress non-crucial messages
            '-loglevel', '8', '-hide_banner',
            // input audio and video by pipe
            '-i', 'pipe:3', '-i', 'pipe:4',
            // map audio and video correspondingly
            '-map', '0:a', '-map', '1:v',
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

        request.once('close', () => {
            console.info('Finish -> destroy process')
            ffmpegProcess.kill();
        })  
    });
    return result;
};

// export it
export default ytmux;

// export other functions, in case you want them
ytmux.download = ytdl;
ytmux.chooseFormat = ytdl.chooseFormat;
ytmux.downloadFromInfo = ytdl.downloadFromInfo;
ytmux.filterFormats = ytdl.filterFormats;
ytmux.getBasicInfo = ytdl.getBasicInfo;
ytmux.getInfo = ytdl.getInfo;
ytmux.getURLVideoID = ytdl.getURLVideoID;
ytmux.getVideoID = ytdl.getVideoID;
ytmux.validateID = ytdl.validateID;
ytmux.validateURL = ytdl.validateURL;