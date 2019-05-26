const { authors } = require("./authors")
const { books } = require("./books")

exports.routes = [authors.routes(), books.routes()]
