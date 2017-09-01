var baseRoute       = 'http://localhost:3300/api/v1/';
// var baseRoute       = 'https://jetgas.herokuapp.com/';
var findURLsPath    = '/api/v1/shortURL/';
var findFolderPath  = '/api/v1/folders/';
var checkfolders    = '/api/v1/checkfolders/';


var newFolderText   = 'Make a new folder';
var newUrlText      = 'Enter a new URL';

// const { urlsByFolderID,
//         allURLs,
//         allFolders,
//         folderByID,
//         redirect,
//         host  } = require('./server/routes.js')

//>--------------------FUNCTIONS--------------------<//
const getFolderByID = id => {
  fetch(`/api/v1/folders/${id}`)
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

  let path = `api/v1/shortURL/${data.shortURL}`
  // let path = `${baseRoute}api/v1/shortURL/${data.shortURL}`
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
  fetch('api/v1/folders')
  .then(resp => resp.json())
  .then(data => printAllFolders(data))
  .catch(error => console.log('error fetching all folders: ', error))
}

const postNewFolderAndURL = data => {
  fetch('/api/v1/folders/', {
    method: "POST",
    body: JSON.stringify({ name: data.name }),
    headers: { "Content-Type": "application/json" }
  })
  .then(resp => resp.json())
  .then(folderID => {
    fetch(findURLsPath, {
      method: "POST",
      body: JSON.stringify({ folder_id:folderID.id, shortURL:data.url }),
      headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(data => fetchAllFolders())
    .catch(error => console.log('error posting to "shortURL": ', error))
  })
  .catch(error => console.log('error posting to "folders": ', error))
}

const postNewURL = (id, url) => {
  fetch('/api/v1/shortURL/', {
    method: "POST",
    body: JSON.stringify({ folder_id:id, shortURL:url }),
    headers: { "Content-Type": "application/json" }
  })
  .then(resp => resp.json())
  .then(data => getFolderByID(data.folder_id))
  .catch(err => console.log('error posting to shortURL at postNewURL()'))
}

const makeNewOrAdd = data => {
  const nameArray = []

  $('.folder-item').each((i,val) => {
    if(val.innerText === data.name) {
      nameArray.push({ id:val.id, shortURL:data.url })
    }
  })

  if(nameArray.length === 1) {
    postNewURL(nameArray[0].id, nameArray[0].shortURL)
  } else {
    postNewFolderAndURL(data)
  }
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

const isUrlValid = (userURL, folder) => {
  var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$"
  var url = new RegExp(regexQuery,"i")

  if (url.test(userURL)) {
    makeNewOrAdd({ url:userURL, name:folder })
    clearInputs()
    return true
  } else {
    alert(`Invalid url, dude!: ${userURL}`)
    return false
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
  const folder = $('.new-folder-input').val()

  if (isUrlValid(url, folder)) {
    // WHAT CAN I DO WHEN isUrlValid RETURNS TRUE OR FALSE?
    alert('great success')
  }

  $('.new-folder-input').val(newFolderText)
  $('.new-url-input').val(newUrlText)

})

$(document).ready(() => {
  fetchAllFolders()
})
