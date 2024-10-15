# WebRTC Screen Recording

A simple WebRTC screen recording application.

## Features

- Record browser screen and audio from a neighboring tab
- Pause and resume recording
- Play back the recorded video
- Save the recorded video to a file

## Usage

`index.html` is a simple WebRTC screen recording application.

To run in development mode, use the `Live Server` extension for VS Code.

Click the hamburger menu button to toggle the menu and set the source frame for the screen recorder.

Click the Record button to start recording from the next tab.

## Limitations

- Only works in browsers that support WebRTC screen recording.
- Only records the browser screen and audio. Does not record other screens or audio sources.
- Does not support recording of protected content (e.g. Netflix, Hulu).
- Does not support recording of multiple screens or audio sources.

[displaySurface](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/displaySurface) option is not supported in Firefox.

## License

This application is licensed under the MIT License. See the LICENSE file for details.
