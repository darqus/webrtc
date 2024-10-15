# WebRTC Screen Recording

A simple WebRTC screen recording application.

## Features

- Record browser screen and audio
- Pause and resume recording
- Play back recorded video
- Save recorded video to file

## Usage

`index.html` is a simple WebRTC screen recording application.

For example running in dev mode, use extension for VS Code `Live Server`.

Click on Hamburger menu button to toggle hamburger menu for set src frame of screen recorder
Click Record button for start recording from the next tab.

## Limitations

- Only works in browsers that support WebRTC screen recording.
- Only records the browser screen and audio. Does not record other screens or audio sources.
- Does not support recording of protected content (e.g. Netflix, Hulu).
- Does not support recording of multiple screens or audio sources.

[displaySurface](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/displaySurface) option is not supported in Firefox.

## License

This application is licensed under the MIT License. See the LICENSE file for details.
