function isUrlValid(userInput) {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery,"i");
    if (url.test(userInput)) {
        alert('valid url: ' + userInput);
        return true;
    }
    alert('invalid url: ' + userInput);
    return false;
}

module.exports = {
  validateURL: isUrlValid
}
