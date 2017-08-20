var serverRoute     = 'http://localhost:3300/api/v1/shortURL/';
var findFolderPath  = 'http://localhost:3300/api/v1/folders/';
var newFolderText   = 'Make a new folder';
var newUrlText      = 'Enter a new URL';


const getFolderByID = id => {
  console.log('id', id)
  fetch(`http://localhost:3300/api/v1/folders/${id}`)
  .then(resp => resp.json())
  .then(details => {
    fetch(`http://localhost:3300/api/v1/folders/${details.folder[0].id}/shortURL`)
    .then(resp => resp.json())
    .then(urlData => {
      printFolderDetails(urlData.shortURLs[0])
    })
  })
  .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {
  $('.dropdown-content').append(
    `<div class="folder-item" id=${data.id}> ${data.name}</div>`
)}

const printFolderDetails = url => {
  let path = `${serverRoute}${url.shortURL}`

  $('.folder-contents').empty()
  $('.folder-contents').append(
    `<a href="${path}" class="folder-item">${path}</a>`
)}

const printAllFolders = folder => {
  for (let i = 0; i < folder.data.length; i++) {
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
  console.log('dataaatta', data)
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
      body: JSON.stringify({folder_id: folderID.id, url: data.url}),
      headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(data => {
      fetchAllFolders()
      $('.new-url-display').replaceWith(
        `<a class="new-url-display" href="http://${data.shortURL}">
            ${data.shortURL}
          </a>`
      )
    })
    .catch(error => console.log('error posting new url', error))
  })
  .catch(error => console.log('error posting new URL: ', error))
}

const getFolders = data => {
  let path = `http://localhost:3300/api/v1/checkfolders${data.folderName}`

  fetch(path)
  .then(resp => resp.json())
  .then(info => {
    if (typeof info === 'string') {
      console.log(info)
    } else {
      console.log('calling postNewFolderAndURL()')
      postNewFolderAndURL(data)
    }
  })
  .catch(error => console.log('error will robinson!: ', error))
}

const disFunc = () => {
  let folder = $('.new-folder-input').val()
  let url    = $('.new-url-input').val()

  if ((folder !== newFolderText) && (url !== newUrlText)) {
    $('.submit-btn').prop('disabled', false)
  } else {
    $('.submit-btn').prop('disabled', true)
  }
}

$('.dropdown-content').on('click', '.folder-item', e => {
  e.preventDefault()
  $('.new-folder-input').val(e.target.textContent)
  getFolderByID(e.target.id)
})

$('.new-url-input').on('focus', e => {
  disFunc()
  if (e.target.value === newUrlText) {
    e.target.value = ''
  }
})

$('.new-url-input').on('blur', e => {
  disFunc()
  if (e.target.value.length === 0) {
    e.target.value = newUrlText
  }
})

$('.new-folder-input').on('focus', e => {
  disFunc()
  if (e.target.value === newFolderText) {
    e.target.value = ''
  }
})

$('.new-folder-input').on('blur', e => {
  disFunc()
  if (e.target.value.length === 0) {
    e.target.value = newFolderText
  }
})

$('.new-folder-input').on('keyup', () => {
  disFunc()
})

$('.new-url-input').on('keyup', () => {
  disFunc()
})

$('.submit-btn').on('click', () => {
  const url = $('.new-url-input').val()
  const folderName = $('.new-folder-input').val()

  $('.new-folder-input').val(newFolderText)
  $('.new-url-input').val(newUrlText)

  disFunc()

  getFolders({
    url: url,
    folderName: folderName
  })

  // postNewFolderAndURL({
  //   url: url,
  //   folderName: folderName
  // })
})


$(document).ready(() => {
  fetchAllFolders()
})
