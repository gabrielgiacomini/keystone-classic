var mongoose = require("mongoose");

module.exports = mongoose.connect("mongodb://localhost/test", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
