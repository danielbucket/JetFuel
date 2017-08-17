const getFolderByID = id => {
  fetch(`http://localhost:3300/api/v1/folders/${id}`)
    .then(resp => resp.json())
    .then(details => printFolderDetails(details.folder[0].created_at))
    .catch(error => console.log('error fetching folder details: ', error))
}

const printFolderList = data => {

  $('.dropdown-content').append(
    `<a href="${ (data) => {getFolderByID(data.id)} }" class="folder-item" >${data.name}</a>`
)}

const printFolderDetails = url => {
  $('.folder-contents').append(
    `<a href="" class="folder-item">${url}</a>`
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

$('.dropdown-content').on('click', '.folder-item', (e) => {
  e.preventDefault()

  getFolderByID()
})















// submit users input
$('.submit-btn').on('click', () => {
  const folder  = $('#new-folder').val()
  const longURL = $('#long-url').val()
})



$(document).ready(() => {
  fetchAllFolders()
})
