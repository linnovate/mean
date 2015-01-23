'use strict';

var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  helper = require('../helpers/general'),
  processError = helper.processError;

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
    if (helper.isAdmin(req.user)) {
      req.body.published = true;
    } else { //if not admin, let us set a flag to allow reading unpublished articles for this time
      req.allowUnpublished = true;
      req.body.published = false;
    }

    req.body.user = req.user;
    var data = req.body;
    var newComment = new Comment(data);

    newComment.save(function(err) {
      if (err) {
        return processError(err, res);
      }
      req.comment = newComment._id;
      $this.show(req, res);
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
    var conditions = {article: articleId};
    if (!helper.isAdmin(req.user)) {
      conditions.published = true;
    }
    Comment.find(conditions)
    .sort({created: 'desc'})
    .populate('article')
    .populate('user')
    .exec(function(err, commentItems) {
      if (err) {
        return processError(err);
      }
      res.json(commentItems);
    });
  },

  /**
   * Get a singular published comment in JSON format
   * (unpublished comments can be retrieved by setting the req.allowUnpublished flag to true)
   * @param  {Object} req The request object with the comment param
   * @param  {Object} res The response object
   * @return {Void}     
   */
  show: function(req, res) {
    var commentId = req.param('comment') || req.comment;
    Comment.findOne({_id: commentId, published: (req.allowUnpublished ? false : true)})
    .populate('article')
    .populate('user')
    .exec(function(err, commentItem) {
      if (err) {
        return processError(err, res);
      }
      res.json(commentItem);
    });
  },

  /**
   * Update an existing comment
   * @param  {Request} req The request object with comment param
   * @param  {Response} res The response object
   * @return {Void}
   */
  update: function(req, res) {
    var commentId = req.param('comment');
    console.log(req.body, commentId);
    Comment.update({_id: commentId}, req.body, function(err, updated) {
      if (err) {
        return processError(err, res);
      }
      req.allowUnpublished = true;
      $this.show(req, res);
    });
  },

  /**
   * Trash an existing comment
   * @param  {Object} req The request object with the comment param
   * @param  {Object} res The response object
   * @return {Void}     
   */
  trash: function(req, res) {
    var commentId = req.param('comment');
    Comment.findOneAndRemove({_id: commentId}, function(err, trashedCommentItem) {
      if (err) {
        return processError(err);
      }
      res.json({trashed: true, item: trashedCommentItem});
    });
  }
};