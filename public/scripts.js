



// submit users input
$('.submit-btn').on('click', () => {
  console.log('working')
  var folder  = $('#new-folder').val()
  var longURL = $('#long-url').val()

  const addNewFolder = folder => {
    fetch('http://localhost:3000/jetfuel/api/v1/folder', {
      method: 'POST',
      body: JSON.stringify(folder),
      headers: { 'Content-type':'application/json' }
    })
      .then(resp => resp.json())
      .then(data => data)
      .catch(error => console.log('error :', error))
  }

  const addNewUrl = longURL => {
      fetch('http://localhost:3000/jetfuel/api/v1/shorturl', {
        method: 'POST',
        body: JSON.stringify(longURL),
        headers: {'Content-type': 'application/json'}
      })
        .then(resp => resp.json())
        .then(data => data)
        .catch(error => console.log('error :', error))
  }

  var fetches = [addNewUrl]

  if (folder) {
    fetches = [addNewFolder, addNewUrl]
  }


  // now what do I do with this?
  return Promise.all(fetches)
                  .then()
})
