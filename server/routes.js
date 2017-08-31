const host            = 'https://jetgas/herokuapp/com';

const version         = '/v1'
const allURLs         = `/api${version}/shortURL/`;
const allFolders      = `/api${version}/folders/`;
const redirect        = `${allURLs}:shorturl`;
const getFolderByID   = `${allFolders}:id`;
const urlsByFolderID  = `${allFolders}:id/shortURL`;

module.exports = {
  urlsByFolderID: urlsByFolderID,
  allURLs: allURLs,
  allFolders: allFolders,
  folderByID: getFolderByID,
  redirectToLongURL: redirect,
  host: host
}
