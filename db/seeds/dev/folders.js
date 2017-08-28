let folderData = [
  { name: 'folderNumber1', urls: [
    {
      id: 1,
      longURL:  'www.longURL1.com',
      shortURL: 'aaa111',
      folder_id: 1
    }
  ]},
  { name: 'folderNumber2', urls: [
    {
      id: 2,
      longURL:  'www.longURL2.com',
      shortURL: 'bbb222',
      folder_id: 1,
    }
  ]},
  { name: 'folderNumber3', urls: [
    {
      id: 3,
      longURL:  'www.longURL3.com',
      shortURL: 'ccc333',
      folder_id: 1
    }
  ]}
]

const createURL = (knex, url) => knex('urls').insert(url)

const createFolder = (knex, folder) => {
  return knex('folders').insert({
    name: folder.name
  }, 'id')
  .then(folderID => {
    let urlPromises = []

    folder.urls.forEach(url => {
      urlPromises.push(
        createURL(knex, {
          id: url.id,
          longURL: url.longURL,
          shortURL: url.shortURL,
          folder_id: folderID[0] // ??
        })
      )
    })
    return Promise.all(urlPromises)
  })
}

exports.seed = (knex, Promise) => {
  return knex('urls').del()
    .then( () => knex('folders').del())
    .then( () => {
      let folderPromises = []

      folderData.forEach(folder => {
        folderPromises.push(createFolder(knex, folder))
      })
      return Promise.all(folderPromises)
    })
    .catch( error => console.log('error seeding data: ', error))
}
