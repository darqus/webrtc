const customFrameTextarea = document.getElementById('customFrame')
const setCustomFrameButton = document.getElementById('setCustomFrame')

setCustomFrameButton.addEventListener('click', () => {
  const iframe = document.querySelector('iframe')
  iframe.src = customFrameTextarea.value
})
