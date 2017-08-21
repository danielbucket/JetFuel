var baseRoute       = 'http://localhost:3300/api/v1/';
var findURLsPath    = `${baseRoute}shortURL/`;
var findFolderPath  = `${baseRoute}folders/`;
var checkfolders    = `${baseRoute}checkfolders/`;

var newFolderText   = 'Make a new folder';
var newUrlText      = 'Enter a new URL';


const getFolderByID = id => {
  fetch(`${findFolderPath}${id}`)
  .then(resp => resp.json())
  .then(details => {
    fetch(`${findFolderPath}${details.id}/shortURL`)
    .then(resp => resp.json())
    .then(urlResponse => {
      console.log('urlData: ', urlResponse.urlData[0])
      printFolderDetails(urlResponse.urlData[0])
    })
  })
  .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {
  $('.dropdown-content').append(
    `<div class="folder-item" id=${data.id}>${data.name}</div>`
)}

const printFolderDetails = url => {
  console.log(url)
  let path = `${findURLsPath}${url.shortURL}`

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
  fetch(findFolderPath)
  .then(resp => resp.json())
  .then(data => printAllFolders(data))
  .catch(error => console.log('error fetching all folders: ', error))
}

const postNewFolderAndURL = data => {
  fetch(findFolderPath, {
    method: "POST",
    body: JSON.stringify({name: data.name}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(folderID => {
    fetch(findURLsPath, {
      method: "POST",
      body: JSON.stringify({folder_id: folderID.id, url: data.url}),
      headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(data => {
      console.log('folderID', data)
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

const postNewURL = (id, url) => {
  fetch(findURLsPath, {
    method: "POST",
    body: JSON.stringify({folder_id: id, shortURL: url}),
    headers: {"Content-Type": "application/json"}
  })
  .then(resp => resp.json())
  .then(data => console.log('data: ', data))
}

const getFolders = data => {
  let path = `${checkfolders}${data.folderName}`

  fetch(path)
  .then(resp => resp.json())
  .then(info => {
    if (info.stat === "FOLDER_EXISTS") {
      console.log('folder does exist')
      postNewURL(info.id, data.url)
    } else if (info.stat === "FOLDER_DOES_NOT_EXIST") {
      console.log('folder does not exist')
      postNewFolderAndURL(data)
    }
  })
  .catch(error => console.log('error will robinson!: ', error))
}

const clearInputs = () => {
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
  clearInputs()
  if (e.target.value === newUrlText) {
    e.target.value = ''
  }
})

$('.new-url-input').on('blur', e => {
  clearInputs()
  if (e.target.value.length === 0) {
    e.target.value = newUrlText
  }
})

$('.new-folder-input').on('focus', e => {
  clearInputs()
  if (e.target.value === newFolderText) {
    e.target.value = ''
  }
})

$('.new-folder-input').on('blur', e => {
  clearInputs()
  if (e.target.value.length === 0) {
    e.target.value = newFolderText
  }
})

$('.new-folder-input').on('keyup', () => {
  clearInputs()
})

$('.new-url-input').on('keyup', () => {
  clearInputs()
})

$('.submit-btn').on('click', () => {
  const url = $('.new-url-input').val()
  const folderName = $('.new-folder-input').val()

  $('.new-folder-input').val(newFolderText)
  $('.new-url-input').val(newUrlText)

  clearInputs()
  getFolders({
    url: url,
    name: folderName
  })
})


$(document).ready(() => {
  fetchAllFolders()
})
