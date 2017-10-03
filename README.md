# Alexa Audio
## Version 0.1

A gulp task for converting and uploading audio for Amazon Alexa.

### Installation

```
git clone git@github.com:vaynermedia/alexa-audio.git
cd alexa-audio
npm install
```

### Install ffmpeg

Alexa Audio requires ffmpeg to be installed.
```
brew install ffmpeg
```

### Set up AWS Credentials

[Set up AWS Credentials and Region for Development](http://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)

### Usage

Transcode audio files
```
gulp process-audio
```

Upload audio
```
gulp upload-audio
```

Transcode and upload audio
```
gulp audio
```
