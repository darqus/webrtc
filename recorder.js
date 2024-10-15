let mediaRecorder
let recordingData = []

const getEl = (id) => document.getElementById(id)

const nodeIds = {
  startButton: 'startRecording',
  pauseButton: 'pauseRecording',
  stopButton: 'stopRecording',
  playButton: 'playRecording',
  saveButton: 'saveRecording',
  statusElement: 'recordStatus',
  recordControls: 'recordControls',
  recordControlsWrapper: 'recordControlsWrapper',
  videoElement: 'recordingVideo',
}

const buttonLabels = {
  startButton: '📹', // start recording
  pauseButton: '⏸️', // pause recording
  stopButton: '⏹', // stop recording
  playButton: '▶️', // play recording
  resumeButton: '▶️', // resume recording
  hideButton: '✕', // hide recording
  saveButton: '📼', // save recording
}

const buttons = [
  { id: nodeIds.startButton, label: buttonLabels.startButton, disabled: false },
  { id: nodeIds.pauseButton, label: buttonLabels.pauseButton, disabled: true },
  { id: nodeIds.stopButton, label: buttonLabels.stopButton, disabled: true },
  { id: nodeIds.playButton, label: buttonLabels.playButton, disabled: true },
  { id: nodeIds.saveButton, label: buttonLabels.saveButton, disabled: true },
]

const nodes = Object.fromEntries(
  Object.entries(nodeIds).map(([key, id]) => [key, getEl(id)]),
)

const statuses = {
  initial: 'Getting ready',
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
    getEl(nodeIds.startButton).disabled = true
    getEl(nodeIds.pauseButton).disabled = false
    getEl(nodeIds.stopButton).disabled = false
    getEl(nodeIds.playButton).disabled = true
    getEl(nodeIds.saveButton).disabled = true
  } catch (error) {
    console.error('capture failure', error)
    setStatus('error', error)
  }
}

const stopRecording = () => {
  setStatus(statuses.stopping)
  mediaRecorder.stop()

  setStatus(statuses.stopped)
  getEl(nodeIds.startButton).disabled = false
  getEl(nodeIds.pauseButton).disabled = true
  getEl(nodeIds.stopButton).disabled = true
  getEl(nodeIds.playButton).disabled = false
  getEl(nodeIds.saveButton).disabled = false
}

const pauseRecording = () => {
  if (mediaRecorder.state === 'paused') {
    setStatus(statuses.starting)
    mediaRecorder.resume()
    nodes.pauseButton.innerText = buttonLabels.pauseButton
  } else if (mediaRecorder.state === statuses.recording) {
    setStatus(statuses.stopping)
    mediaRecorder.pause()
    nodes.pauseButton.innerText = buttonLabels.resumeButton
  }
}

const playRecording = () => {
  nodes.videoElement.style.visibility = 'visible'
  if (nodes.videoElement.style.visibility === 'visible') {
    setStatus(statuses.started)
    nodes.videoElement.src = window.URL.createObjectURL(
      new Blob(recordingData, options),
    )
    nodes.videoElement.play()
    nodes.playButton.innerText = buttonLabels.hideButton
  } else {
    setStatus(statuses.stopped)
    nodes.playButton.innerText = buttonLabels.playButton
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

const getButtons = () => buttons.map(({ id, label, disabled }) => {
    const button = document.createElement('button')
    button.id = id
    button.innerHTML = label
    button.disabled = disabled
    button.classList.add('record-btn')
    return button
  })

const createControls = () => {
  const controls = document.createElement('div')
  controls.id = nodeIds.recordControls

  const buttons = getButtons()

  buttons.forEach((button) => controls.appendChild(button))

  return controls
}

const addEventListeners = () => {
  getEl(nodeIds.startButton).addEventListener('click', startRecording)
  getEl(nodeIds.stopButton).addEventListener('click', stopRecording)
  getEl(nodeIds.pauseButton).addEventListener('click', pauseRecording)
  getEl(nodeIds.playButton).addEventListener('click', playRecording)
  getEl(nodeIds.saveButton).addEventListener('click', saveRecording)
}

getEl(nodeIds.recordControlsWrapper).appendChild(createControls())

addEventListeners()

setStatus(statuses.initial)
