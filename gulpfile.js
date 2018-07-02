const gulp      = require('gulp'),
      Plugins   = require('gulp-load-plugins');
      filePath  = '',
      bucketName = 'Audio-Bucket';

const plugins = Plugins({
    DEBUG: false,
    camelize: true,
    pattern: ['*'],
    scope: ['devDependencies'],
    replaceString: /^gulp(-|\.)/,
    lazy: false
});

///////////
// AUDIO //
///////////

gulp.task('process-audio', done => {
    // transcode WAV files to mp3
    return gulp.src('./audio/src/**/*.@(WAV|wav|ogg|mp3)')
        .pipe(plugins.changed('./audio/dist'))
        .pipe(plugins.fluentFfmpeg('mp3', function(cmd) {
            return cmd
                .audioBitrate('48k')
                .audioFrequency(16000)
                .audioChannels(2)
                .audioCodec('libmp3lame');
        }))
        .pipe(gulp.dest('./audio/dist'));
});

const s3 = plugins.s3Upload({ useIAM: true });

gulp.task('upload-audio', done => {
    const filePath = ''
    return gulp.src("./audio/dist/**/*.mp3")
        .pipe(s3({
            Bucket: `${bucketName}`,
            ACL: 'public-read',
            keyTransform: function(filename) {
                return `${filePath}${filename}`;
            }
        }, {
            maxRetries: 5
        }));
});

gulp.task('audio', gulp.series('process-audio', 'upload-audio'));
