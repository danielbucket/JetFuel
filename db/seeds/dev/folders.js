let folderData = [
  { name: 'folderNumber1', urls: [
    {
      id: 901,
      shortURL: 'aaa111',
      longURL:  'www.longURL1.com'
    }
  ]},
  { name: 'folderNumber2', urls: [
    {
      id: 902,
      shortURL: 'bbb222',
      longURL:  'www.longURL2.com'
    }
  ]},
  { name: 'folderNumber3', urls: [
    {
      id: 903,
      shortURL: 'ccc333',
      longURL:  'www.longURL3.com'
    }
  ]}
]

const createFolder = (knex, folder) => {
  return knex('folders').insert({
    name: folder.name
  }, 'id')
  .then(folderID => {
    let urlPromises = []

    folder.urls.forEach(url => {
      urlPromises.push(
        createURL(knex, {
          shortURL: url,
          folder_id: folderID[0]
        })
      )
    })
    return Promise.all(urlPromises)
  })
}

const createURL = (knex, url) => {
  return knex('urls').insert(url)
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
