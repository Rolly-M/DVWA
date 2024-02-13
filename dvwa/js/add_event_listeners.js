// These functions need to be called after the content they reference
// has been added to the page otherwise they will fail.

function addEventListeners () {
  const source_button = document.getElementById('source_button')

  if (source_button) {
    source_button.addEventListener('click', function () {
      const url = source_button.dataset.sourceUrl
      popUp(url)
    })
  }

  const help_button = document.getElementById('help_button')

  if (help_button) {
    help_button.addEventListener('click', function () {
      const url = help_button.dataset.helpUrl
      popUp(url)
    })
  }
}

addEventListeners()
