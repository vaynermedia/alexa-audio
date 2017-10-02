/*globals require*/
"use strict";
// "Card \d+: ([\w\s]*)",
// GULP FILE
const gulp      = require('gulp'),
    _           = require('lodash'),
    util        = require('util'),
    Plugins     = require('gulp-load-plugins');

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
  return gulp.src('./audio/src/**/*.@(WAV|wav|ogg|mp3)')
    .pipe(plugins.changed('./audio/dist'))
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
  return gulp.src("./audio/dist/**/*.mp3")
    .pipe(s3({
        Bucket: bucket,
        ACL:    'public-read',
        keyTransform: function(filename) {
            return `${folder}${filename}`;
        }
    },
    {
        maxRetries: 5
    }));
});

gulp.task('audio', done => {
    plugins.runSequence('process-audio', 'upload-audio', done);
});
