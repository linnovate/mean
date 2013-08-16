/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {type : Date, default : Date.now},
	title: {type: String, default: '', trim : true},
	content: {type: String, default: '', trim : true},
	user: {type : Schema.ObjectId, ref : 'User'}
});

/**
 * Statics
 */
ArticleSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('user').exec(cb);
  }
};

mongoose.model('Article', ArticleSchema);