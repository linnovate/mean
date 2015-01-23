'use strict';

var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  processError = function(err, res) {
    return res.status(500).json({
      error: err.message
    });
  };;

/**
 * A reference to self
 */
var $this;

module.exports = $this = {

  /**
   * Create a new comment
   * @param  {Object} req The request object with details in it's body property
   * @param  {Object} res The response object
   * @return {Void}     
   */
  create: function(req, res) {
    /**
     * Lets publish all comments written by admin by default
     */
    if (req.user.isAdmin()) {
      req.body.published = true;
    } else { //if not admin, let us set a flag to allow reading unpublished articles for this time
      req.allowUnpublished = true;
    }

    req.body.user = req.user;
    var data = req.body;
    var newComment = new Comment(data);

    newComment.save(function(err) {
      if (err) {
        return processError(err, res);
      }
    });
  },

  /**
   * Get list of all comments relating to an article
   * @param  {Object} req The request object with the article param
   * @param  {Object} res The response object
   * @return {Void}     
   */
  list: function(req, res) {
    var articleId = req.param('article');
    Comment.find({article: articleId, published: true})
    .populate('article')
    .populate('user')
    .exec(function(err, commentItems) {
      if (err) {
        return processError(err);
      }
      res.json(commentItems);
    });
  }


};