export default class FetchCalls {

  getAllFolders() {
    fetch('/api/v1/folders')
      .then(resp => resp.json())
      .catch(error => console.log('error fetching all folders: ', error))
  }

  postNewFolder(folderName) {
    fetch('/api/v1/folders', {
      method: "POST",
      body: JSON.stringify(folderName),
      headers: {'Content-Type':'application/json'}
    })
      .then(resp => resp.json)
      .catch(error => console.log('error fetching new folder: ', error))
  }

  getFolderURLs(id) {
    fetch(`/api/v1/folders/${id}/shortURL`)
      .then(resp => resp.json())
      .catch(error => console.log('error fetching urls', error))
  }

  getFolderByID(id) {
    fetch(`/api/v1/folders/${id}`)
    .then(resp => resp.json())
    .catch(error => console.log('error fetching folder by id', error))
  }
}
