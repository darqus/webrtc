const getEl = (id) => document.getElementById(id)

const nodes = {
  startButton: getEl('startRecording'),
  pauseButton: getEl('pauseRecording'),
  stopButton: getEl('stopRecording'),
  playButton: getEl('playRecording'),
  saveButton: getEl('saveRecording'),
  statusElement: getEl('recordStatus'),
  videoElement: getEl('recordingVideo'),
}

const statuses = {
  starting: 'Starting recording...',
  started: 'Recording...',
  stopping: 'Stopping recording...',
  stopped: 'Recording stopped',
  saving: 'Saving recording...',
  saved: 'Recording saved',
  error: 'Error: ',
}

const options = {
  type: 'video/webm; codecs="vp8,opus"'
}

let mediaRecorder
let recordingData = []

const getFileName = () => {
  const now = new Date()
  const timestamp = now.toISOString()
  const room = document.title.match(/(^.+)\s\|/)
  return room && room[1] ? `${room[1]}_${timestamp}` : `recording_${timestamp}`
}

const setStatus = (status) => {
  nodes.statusElement.innerText = status
}

const startRecording = async () => {
  setStatus(statuses.starting)
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' },
      audio: { channelCount: 2 },
    })

    const mixedStream = new MediaStream()
    displayStream
      .getAudioTracks()
      .forEach((track) => mixedStream.addTrack(track))
    displayStream
      .getVideoTracks()
      .forEach((track) => mixedStream.addTrack(track))
    audioStream.getAudioTracks().forEach((track) => mixedStream.addTrack(track))


    mediaRecorder = new MediaRecorder(mixedStream, options)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordingData.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      mixedStream.getTracks().forEach((track) => track.stop())
    }

    mixedStream.addEventListener('inactive', stopRecording)

    mediaRecorder.start()

    setStatus(statuses.started)
    nodes.startButton.disabled = true
    nodes.pauseButton.disabled = false
    nodes.stopButton.disabled = false
    nodes.playButton.disabled = true
    nodes.saveButton.disabled = true
  } catch (error) {
    console.error('capture failure', error)
    setStatus('error', error)
  }
}

const stopRecording = () => {
  setStatus(statuses.stopping)
  mediaRecorder.stop()

  setStatus(statuses.stopped)
  nodes.startButton.disabled = false
  nodes.pauseButton.disabled = true
  nodes.stopButton.disabled = true
  nodes.playButton.disabled = false
  nodes.saveButton.disabled = false
}

const pauseRecording = () => {
  if (mediaRecorder.state === 'paused') {
    setStatus(statuses.starting)
    mediaRecorder.resume()
    nodes.pauseButton.innerText = 'Pause'
  } else if (mediaRecorder.state === 'recording') {
    setStatus(statuses.stopping)
    mediaRecorder.pause()
    nodes.pauseButton.innerText = 'Resume'
  }
}

const playRecording = () => {
  nodes.videoElement.hidden = !nodes.videoElement.hidden
  if (!nodes.videoElement.hidden) {
    setStatus(statuses.started)
    nodes.videoElement.src = window.URL.createObjectURL(
      new Blob(recordingData, options),
    )
    nodes.videoElement.play()
    nodes.playButton.innerText = 'Hide'
  } else {
    setStatus(statuses.stopped)
    nodes.playButton.innerText = 'Play'
  }
}

const saveRecording = () => {
  setStatus('saving')
  const blob = new Blob(recordingData, options)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = `${getFileName()}.webm`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 100)
  setStatus('saved')
}

nodes.startButton.addEventListener('click', startRecording)
nodes.stopButton.addEventListener('click', stopRecording)
nodes.pauseButton.addEventListener('click', pauseRecording)
nodes.playButton.addEventListener('click', playRecording)
nodes.saveButton.addEventListener('click', saveRecording)
