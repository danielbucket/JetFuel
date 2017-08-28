// var baseRoute       = 'http://localhost:3300/api/v1/';
var baseRoute       = 'https://jetgas.herokuapp.com/';
var findURLsPath    = `/shortURL/`;
var findFolderPath  = `/folders/`;
var checkfolders    = `/checkfolders/`;

var newFolderText   = 'Make a new folder';
var newUrlText      = 'Enter a new URL';

//>--------------------FUNCTIONS--------------------<//
const getFolderByID = id => {
  fetch(`${findFolderPath}${id}`)
  .then(resp => resp.json())
  .then(details => {
    fetch(`${findFolderPath}${details.id}/shortURL`)
    .then(resp => resp.json())
    .then(urlResponse => printFolderDetails(urlResponse.urlData))
  })
  .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {
  $('.dropdown-content').append(
    `<option class="folder-item" id=${data.id}>${data.name}</option>`
)}

const printFolderDetailsList = data => {
  let time = data.created_at.slice(0,10)

  let path = `${findURLsPath}${data.shortURL}`
  $('.folder-contents-display').append(
    `<li><a href="${path}" class="folder-item">${path}</a>
    <div class="creation-date">Created On: ${time}</div></li>`
  )
}

const printFolderDetails = url => {
  const sorted = url.sort((a,b) => {
    return a.created_at > b.created_at
  })
  $('.folder-contents-display').empty()
  for (let i = 0; i < sorted.length; i++) {
    printFolderDetailsList(sorted[i])
  }
}

const printAllFolders = folder => {
  $('.dropdown-content').empty()
  $('.dropdown-content').append(
    `<option class="folder-item" selected="selected">Select A Folder</option>`
  )
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
    body: JSON.stringify({ name: data.name }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(folderID => {
    fetch(findURLsPath, {
      method: "POST",
      body: JSON.stringify({folder_id: folderID.id, shortURL: data.url}),
      headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(data => fetchAllFolders())
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
  .then(data => getFolderByID(data.folder_id))
}

const getFolders = data => {
  fetch(`${checkfolders}${data.name}`)
  .then(resp => resp.json())
  .then(info => {
    if (info.stat === "FOLDER_EXISTS") {
      postNewURL(info.folderID, data.url)
    } else if (info.stat === "FOLDER_DOES_NOT_EXIST") {
      postNewFolderAndURL(data)
    }
  })
  .catch(error => console.log('error will robinson!: ', error))
}

const clearInputs = () => {
  let folder = $('.new-folder-input').val()
  let url    = $('.new-url-input').val()

  if ((folder !== newFolderText) && (url !== newUrlText) || folder === 'Select A Folder') {
    $('.submit-btn').prop('disabled', false)
  } else {
    $('.submit-btn').prop('disabled', true)
  }
}

//>--------------------EVENTS--------------------<//
$('.dropdown-content').change(() => {
  const selected = $('.dropdown-content option:selected')

  $('.new-folder-input').val(selected[0].innerText)
  clearInputs()
  getFolderByID(selected[0].id)
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

$('.new-folder-input').on('keyup', () => clearInputs())
$('.new-url-input').on('keyup', () => clearInputs())

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
