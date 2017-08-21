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
      printFolderDetails(urlResponse.urlData)
    })
  })
  .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {
  $('.dropdown-content').append(
    `<div class="folder-item" id=${data.id}>${data.name}</div>`
)}

const printFolderDetailsList = data => {
  let path = `${findURLsPath}${data.shortURL}`

  $('.folder-contents').append(
    `<a href="${path}" class="folder-item">${path}</a>`
  )
}

const printFolderDetails = url => {
  $('.folder-contents').empty()
  for (let i = 0; i < url.length; i++) {
    printFolderDetailsList(url[i])
  }
}

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
  console.log(data)
  fetch(findFolderPath, {
    method: "POST",
    body: JSON.stringify({ name: data.name }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(folderID => {
    console.log(folderID)
    fetch(findURLsPath, {
      method: "POST",
      body: JSON.stringify({folder_id: folderID.id, shortURL: data.url}),
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

const postNewURL = (id, url) => {
  console.log(id)
  fetch(findURLsPath, {
    method: "POST",
    body: JSON.stringify({folder_id: id, shortURL: url}),
    headers: {"Content-Type": "application/json"}
  })
  .then(resp => resp.json())
  .then(data => {
    // call func to print all new folder data(?)
    console.log('data: ', data)
  })
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
