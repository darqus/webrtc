let mediaRecorder
let recordedChunks = []

const getElementById = (id) => document.getElementById(id)

const elementIds = {
  startButton: 'startRecording',
  pauseButton: 'pauseRecording',
  stopButton: 'stopRecording',
  playButton: 'playRecording',
  saveButton: 'saveRecording',
  statusDisplay: 'recordStatus',
  controlsContainer: 'recordControls',
  controlsWrapper: 'recordControlsWrapper',
  videoElement: 'recordingVideo',
}

const buttonIcons = {
  start: '🎦',
  pause: '⏸️',
  stop: '⏹️',
  play: '▶️',
  resume: '⏯️',
  hide: '⏏️',
  save: '🔽',
}

const buttonConfigs = [
  { id: elementIds.startButton, icon: buttonIcons.start, disabled: false },
  { id: elementIds.pauseButton, icon: buttonIcons.pause, disabled: true },
  { id: elementIds.stopButton, icon: buttonIcons.stop, disabled: true },
  { id: elementIds.playButton, icon: buttonIcons.play, disabled: true },
  { id: elementIds.saveButton, icon: buttonIcons.save, disabled: true },
]

const statusMessages = {
  initial: 'Getting ready',
  starting: 'Starting recording...',
  recording: 'Recording...',
  paused: 'Paused recording...',
  stopped: 'Recording stopped',
  saving: 'Saving recording...',
  saved: 'Recording saved',
  error: 'Error: ',
}

const mediaOptions = {
  type: 'video/webm; codecs="vp8,opus"',
}

const generateFileName = () => {
  const now = new Date()
  const timestamp = now.toISOString()
  const roomMatch = document.title.match(/(^.+)\s\|/)
  return roomMatch && roomMatch[1]
    ? `${roomMatch[1]}_${timestamp}`
    : `recording_${timestamp}`
}

const updateStatus = (status) => {
  getElementById(elementIds.statusDisplay).innerText = status
}

const startRecording = async () => {
  updateStatus(statusMessages.starting)
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })

    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' },
      audio: {
        restrictOwnAudio: false,
        channelCount: 2,
        autoGainControl: true,
      },
    })

    const mixedStream = new MediaStream()
    ;[
      ...displayStream.getAudioTracks(),
      ...displayStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ].forEach((track) => mixedStream.addTrack(track))

    mediaRecorder = new MediaRecorder(mixedStream, mediaOptions)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      mixedStream.getTracks().forEach((track) => track.stop())
    }

    mixedStream.addEventListener('inactive', stopRecording)

    mediaRecorder.start()

    updateStatus(statusMessages.recording)
    getElementById(elementIds.startButton).disabled = true
    getElementById(elementIds.pauseButton).disabled = false
    getElementById(elementIds.stopButton).disabled = false
    getElementById(elementIds.playButton).disabled = true
    getElementById(elementIds.saveButton).disabled = true
  } catch (error) {
    console.error('capture failure', error)
    updateStatus(`${statusMessages.error} ${error}`)
  }
}

const stopRecording = () => {
  updateStatus(statusMessages.paused)
  mediaRecorder.stop()

  updateStatus(statusMessages.stopped)
  getElementById(elementIds.startButton).disabled = false
  getElementById(elementIds.pauseButton).disabled = true
  getElementById(elementIds.stopButton).disabled = true
  getElementById(elementIds.playButton).disabled = false
  getElementById(elementIds.saveButton).disabled = false
}

const pauseRecording = () => {
  if (mediaRecorder.state === 'paused') {
    updateStatus(statusMessages.recording)
    mediaRecorder.resume()
    getElementById(elementIds.pauseButton).innerText = buttonIcons.pause
  } else if (mediaRecorder.state === 'recording') {
    updateStatus(statusMessages.paused)
    mediaRecorder.pause()
    getElementById(elementIds.pauseButton).innerText = buttonIcons.resume
  }
}

const playRecording = () => {
  const video = getElementById(elementIds.videoElement)
  if (video.style.visibility === 'visible') {
    video.style.visibility = 'hidden'
    updateStatus(statusMessages.stopped)
    getElementById(elementIds.playButton).innerText = buttonIcons.play
  } else {
    video.style.visibility = 'visible'
    video.src = window.URL.createObjectURL(
      new Blob(recordedChunks, mediaOptions),
    )
    video.play()
    updateStatus(statusMessages.recording)
    getElementById(elementIds.playButton).innerText = buttonIcons.hide
  }
}

const saveRecording = () => {
  updateStatus(statusMessages.saving)
  const blob = new Blob(recordedChunks, mediaOptions)
  const url = window.URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.style.display = 'none'
  downloadLink.href = url
  downloadLink.download = `${generateFileName()}.webm`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  setTimeout(() => {
    document.body.removeChild(downloadLink)
    window.URL.revokeObjectURL(url)
  }, 100)
  updateStatus(statusMessages.saved)
}

const createButtonElements = () =>
  buttonConfigs.map(({ id, icon, disabled }) => {
    const button = document.createElement('button')
    button.id = id
    button.innerHTML = icon
    button.disabled = disabled
    button.classList.add('record-btn')
    return button
  })

const createControlElements = () => {
  const controlsContainer = document.createElement('div')
  controlsContainer.id = elementIds.controlsContainer

  const buttons = createButtonElements()

  buttons.forEach((button) => controlsContainer.appendChild(button))

  return controlsContainer
}

const addEventListeners = () => {
  getElementById(elementIds.startButton).addEventListener(
    'click',
    startRecording,
  )
  getElementById(elementIds.stopButton).addEventListener('click', stopRecording)
  getElementById(elementIds.pauseButton).addEventListener(
    'click',
    pauseRecording,
  )
  getElementById(elementIds.playButton).addEventListener('click', playRecording)
  getElementById(elementIds.saveButton).addEventListener('click', saveRecording)
}

getElementById(elementIds.controlsWrapper).appendChild(createControlElements())

addEventListeners()

updateStatus(statusMessages.initial)
