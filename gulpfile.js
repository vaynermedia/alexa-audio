/*globals require*/
"use strict";
// "Card \d+: ([\w\s]*)",
// GULP FILE
const gulp      = require('gulp'),
    _           = require('lodash'),
    util        = require('util'),
    Plugins     = require('gulp-load-plugins');
    AUDIO_SRC   = './audio/src',
    AUDIO_DST   = './audio/dist',
    S3_BUCKET   = '';
    S3_FOLDER   = '';

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
  // transcode files to mp3
  return gulp.src(`${AUDIO_SRC}/**/*.@(WAV|wav|ogg|mp3)`)
    .pipe(plugins.changed(`${AUDIO_DST}`))
    .pipe(plugins.fluentFfmpeg('mp3', function (cmd) {
      return cmd
        .audioBitrate('48k')
        .audioFrequency(16000)
        .audioChannels(2)
        .audioCodec('libmp3lame');
    }))
    .pipe(gulp.dest('./audio/dist'));
});

const s3 = plugins.s3Upload({useIAM: true});

gulp.task('upload-audio', done => {
  return gulp.src(`${AUDIO_DST}/**/*.mp3`)
    .pipe(s3({
        Bucket: S3_BUCKET,
        ACL:    'public-read',
        keyTransform: function(filename) {
            return `${S3_FOLDER}/${filename}`;
        }
    },
    {
        maxRetries: 5
    }));
});

gulp.task('audio', done => {
    plugins.runSequence('process-audio', 'upload-audio', done);
});
