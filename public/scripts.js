const getFolderByID = id => {
  fetch(`http://localhost:3300/api/v1/folders/${id}`)
    .then(resp => resp.json())
    .then(details => {
      fetch(`http://localhost:3300/api/v1/folders/${details.folder[0].id}/shortURL`)
      .then(resp => resp.json())
      .then(urlData => {
        printFolderDetails(urlData.shortURLs[0].shortURL)
      })
    })
    .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {
  $('.dropdown-content').append(
    `<div class="folder-item" id=${data.id}> ${data.name}</div>`
)}

const printFolderDetails = url => {
  $('.folder-contents').replaceWith(
    `<a href="http://${url}" class="folder-item">${url}</a>`
)}

const printAllFolders = folder => {
  for (var i = 0; i < folder.data.length; i++) {
    printFolderList(folder.data[i])
  }
}

const fetchAllFolders = () => {
  fetch('http://localhost:3300/api/v1/folders')
  .then(resp => resp.json())
  .then(data => printAllFolders(data))
  .catch(error => console.log('error fetching all folders: ', error))
}

const postNewFolderAndURL = data => {
  fetch('http://localhost:3300/api/v1/folders', {
    method: "POST",
    body: JSON.stringify({name: data.folderName}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(folderID => {
    fetch('http://localhost:3300/api/v1/shortURL', {
      method: "POST",
      body: JSON.stringify({folder_id: folderID.id, shortURL: data.url}),
      headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(data => {
      fetchAllFolders()
      $('.new-url-display').replaceWith(
        `
          <a class="new-url-display" href="http://${data.shortURL}">
            ${data.shortURL}
          </a>
        `
      )
    })
    .catch(error => console.log('error posting new url', error))
  })
  .catch(error => console.log('error posting new URL: ', error))
}




$('.dropdown-content').on('click', '.folder-item', e => {
  e.preventDefault()
  getFolderByID(e.target.id)
})

$('.new-url-input').on('focus', e => {
  if (e.target.value.length = 0) {
    e.target.value = 'Make a new folder'
  }
})

$('.new-folder-input').on('focus', e => {
  e.target.value = ''
})

$('.new-folder-input').on('blur', e => {
  console.log(e.target.value.length)

  if (e.target.value.length = 0) {
    e.target.value = 'Make a new folder'
  }
})

// $('.new-url-input').on('blur', e => {
//   if (e.target.value.length > 0) {
//     e.target.value = ''
//   } else {
//     e.target.value = 'Enter a new URL'
//   }
// })

$('.submit-btn').on('click', () => {
  const url = $('.new-url-input').val()
  const folderName = $('.new-folder-input').val()

  postNewFolderAndURL({
    url: url,
    folderName: folderName
  })
})












// submit users input
$('.submit-btn').on('click', () => {

  const folder  = $('#new-folder').val()
  const longURL = $('#long-url').val()
})



$(document).ready(() => {
  fetchAllFolders()
})
