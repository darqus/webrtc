const customFrameSrcInput = document.getElementById('customFrame')
const setCustomFrameButton = document.getElementById('setCustomFrame')
const hamburgerToggle = document.querySelector('.hamburger-button')
const hamburgerMenu = document.querySelector('.hamburger-menu')
const recordBtn = document.querySelector('#recordButton')
const stopBtn = document.querySelector('#stopButton')

const hamburgerToggleIcons = {
  open: '☰',
  close: '✕',
}

setCustomFrameButton.addEventListener('click', () => {
  const iframe = document.querySelector('iframe')
  iframe.src = customFrameSrcInput.value
})

customFrameSrcInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const iframe = document.querySelector('iframe')
    iframe.src = customFrameSrcInput.value
  }
})

hamburgerToggle.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('open')
  hamburgerToggle.innerText = hamburgerMenu.classList.contains('open')
    ? hamburgerToggleIcons.close
    : hamburgerToggleIcons.open
})

recordBtn.addEventListener('click', () => {
  window.postMessage(
    {
      type: 'start-record',
      data: 'record: ' + new Date(),
    },
    '*',
  )
})

stopBtn.addEventListener('click', () => {
  window.postMessage(
    {
      type: 'stop-record',
      data: 'stop: ' + new Date(),
    },
    '*',
  )
})
