var newFolderText = 'Make a new folder';
var newUrlText = 'Enter a new URL';


//>--------------------FUNCTIONS--------------------<//
const getFolderByID = id => {
  fetch(`/api/v1/folders/${id}`)
  .then(resp => resp.json())
  .then(details => {
    fetch(`/api/v1/folders/${details.id}/shortURL`)
    .then(resp => resp.json())
    .then(urlResponse => {
      printFolderDetails(urlResponse.urlData)
    })
  })
  .catch(error => console.log('ERROR: GET folders @ getFolderByID: ', error))
}

const mapFolderName = data => {
  $('.dropdown-content').append(
    `<option class="folder-item" id=${data.id}>${data.name}</option>`
)}

const printFolderDetailsList = data => {
  let time = data.created_at.slice(0,10)

  let path = `api/v1/shortURL/${data.shortURL}`
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
   mapFolderName(folder.data[i])
  }
}

const fetchAllFolders = () => {
  fetch('/api/v1/folders/')
  .then(resp => resp.json())
  .then(data => printAllFolders(data))
  .catch(error => console.log('ERROR: GET folders @ fetchAllFolders: ', error))
}

const postNewFolderAndURL = data => {
  fetch('/api/v1/folders/', {
    method: "POST",
    body: JSON.stringify({ name:data.name }),
    headers: { "Content-Type": "application/json" }
  })
  .then(resp => resp.json())
  .then(folderID => {
    fetch('/api/v1/shortURL/', {
      method: "POST",
      body: JSON.stringify({ folder_id:folderID.id, shortURL:data.url }),
      headers: {"Content-Type":"application/json"}
    })
    .then(resp => resp.json())
    .then(data => fetchAllFolders())
    .catch(error => console.log('ERROR: POST shortURL @ postNewFolderAndURL :', error))
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
  .catch(err => console.log('ERROR: POST shortURL @ postNewURL: ', err))
}

const activateSubmitBtn = () => {
  let folder = $('.new-folder-input').val()
  let url = $('.new-url-input').val()

  if ((folder !== newFolderText) && (url !== newUrlText) || folder === 'Select A Folder') {
    $('.submit-btn').prop('disabled', false)
  } else {
    $('.submit-btn').prop('disabled', true)
  }
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
    printFolderDetails([nameArray[0].id])
  } else {
    postNewFolderAndURL(data)
  }
}

const isUrlValid = (userURL, folder) => {
  var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$"
  var url = new RegExp(regexQuery,"i")

  if(url.test(userURL)) {
    makeNewOrAdd({ url:userURL, name:folder })
    $('#new-folder-input')[0].value = newFolderText
    $('#new-url-input')[0].value = newUrlText
  } else {
    alert(`Invalid url, dude! "${userURL}" is not an invalid url, dude.`)
  }
}

//>--------------------EVENTS--------------------<//
$('.dropdown-content').change(() => {
  const selected = $('.dropdown-content option:selected')

  $('#new-folder-input').val(selected[0].innerText)
  activateSubmitBtn()
  getFolderByID(selected[0].id)
})

$('#new-url-input').on('focus', e => {
  activateSubmitBtn()
  if (e.target.value === newUrlText) {
    e.target.value = ""
  }
})

$('#new-url-input').on('blur', e => {
  activateSubmitBtn()
  if (e.target.value.length === 0) {
    e.target.value = newUrlText
  }
})

$('#new-folder-input').on('focus', e => {
  activateSubmitBtn()
  if (e.target.value === newFolderText) {
    e.target.value = ""
  }
})

$('#new-folder-input').on('blur', e => {
  activateSubmitBtn()
  if (e.target.value.length === 0) {
    e.target.value = newFolderText
  }
})

$('#new-folder-input').on('keyup', () => activateSubmitBtn())
$('#new-url-input').on('keyup', () => activateSubmitBtn())

$('.submit-btn').on('click', () => {
  const url = $('#new-url-input').val()
  const folder = $('#new-folder-input').val()

  isUrlValid(url, folder)
})

$(document).ready(() => {
  fetchAllFolders()
})
