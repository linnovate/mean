'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    formidable = require('formidable'),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');
    
var uploadsDir = process.cwd() + '/public/uploads';


/**
 * Find lista by id
 */
exports.article = function(req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return next(new Error('Failed to load article ' + id));
    }
    Article.findById(id).exec(function (err, article) {
        if (err) {
            return next(err);
        }
        if (!article) {
            return next(new Error('Failed to load article ' + id));
        }
        req.article = article;
        next();
    });
};

/**
 * Create an article
 */
exports.create = function(req, res) {
    var article = new Article(req.body);
    article.user = req.user;
    article.save(function(err) {
        if (err) {
            return res.json(500,{
                error: 'Cannot save the article'
            });
        }
        res.json(article);
    });
};

/**
 * Upload avatar article
 */
exports.upload = function(req, res) {
    var form = new formidable.IncomingForm;
    form.parse(req, function(err, fields, files){
        if(err){
            return res.json(500, err.message);
        }
        var tmpfilename = files.avatar.path;
        var filename = uploadsDir + '/' + files.avatar.name;
        fs.rename(tmpfilename, filename , function (err) {
            if (err){
               return res.json(500, err); 
            } 
            res.json(200,{avatar:files.avatar.name});
        });
    });
};

/**
 * Update an article
 */
exports.update = function(req, res) {
    var article = req.article;
    article = _.extend(article, req.body);
    article.save(function(err) {
        if (err) {
            return res.json(500, err);
        } 
        res.json(article);
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if (err) {
             return res.json(500, err);
        } 
        res.json(article);
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.json(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Article.find().sort('-created').exec(function(err, articles) {
        if (err) {
            return res.json(500, err);
        } 
        res.json(articles);
    });
};

/**
 * List of categories
 */
exports.categories = function(req, res) {
    Article.distinct('categories').exec(function(err, categories) {
        if (err) {
           return res.json(500,{ error: 'Cannot get the categories' });
        }
        res.json(categories); 
    });
};

