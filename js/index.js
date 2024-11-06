const customFrameSrcInput = document.getElementById('customFrame')
const setCustomFrameButton = document.getElementById('setCustomFrame')
const hamburgerToggle = document.querySelector('.hamburger-button')
const hamburgerMenu = document.querySelector('.hamburger-menu')
// const recordBtn = document.querySelector('#recordButton')
// const stopBtn = document.querySelector('#stopButton')
const hideVideo = document.querySelector('#hideVideo')
const showVideo = document.querySelector('#showVideo')

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

// recordBtn.addEventListener('click', () => {
//   // send native event
//   window.postMessage(
//     {
//       type: 'start-record-from-tab',
//       data: 'record: ' + new Date(),
//     },
//     '*',
//   )
//   /* chrome.runtime.sendMessage(
//     'gddiikjkogpnlbejhjenjfhjmokamoji',
//     {
//       type: 'start-record-from-tab',
//       target: 'offscreen',
//     },
//     (e) => {
//       console.log(e)
//     },
//   ) */
// })

// stopBtn.addEventListener('click', () => {
//   // send native event
//   window.postMessage(
//     {
//       type: 'stop-record-from-tab',
//       data: 'stop: ' + new Date(),
//     },
//     '*',
//   )
//   /* chrome.runtime.sendMessage(
//     'gddiikjkogpnlbejhjenjfhjmokamoji',
//     {
//       type: 'stop-recording-from-tab',
//       target: 'offscreen',
//     },
//     (e) => {
//       console.log(e)
//     },
//   ) */
// })

// hideVideo.addEventListener('click', () => {
//   const videoTags = document.querySelectorAll('video')
//   videoTags.forEach((videoTag) => {
//     videoTag.setAttribute('hidden', '')
//   })
// })

// showVideo.addEventListener('click', () => {
//   const videoTags = document.querySelectorAll('video')
//   videoTags.forEach((videoTag) => {
//     videoTag.removeAttribute('hidden')
//   })
// })
