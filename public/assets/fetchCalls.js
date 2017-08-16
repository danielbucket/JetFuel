import { baseRoute } from '../../server/server';

export default class FetchCalls {

  makeNewFolder() {

    const addNewFolder = fetch(`${baseRoute}folder`, () => {
                          .then(resp => resp.json())
                          .then(data => data)
                          .catch(error => console.log('error :', error))
    })

    const addNewUrl = fetch(`${baseRoute}shorturl`, () => {
                        .then(resp => resp.json())
                        .then(data => data)
                        .catch(error => console.log('error :', error))
    })

    return return Promise.all([addNewFolder, addNewUrl])
                    .then()
  }
}
