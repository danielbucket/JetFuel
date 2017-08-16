import { baseRoute } from '../../server/server';

export default class FetchCalls {

  getAllFolders() {
    fetch('/api/v1/folders')
      .then(resp => resp.josn())
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
}
