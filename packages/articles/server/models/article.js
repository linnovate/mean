'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,   
        trim: true
    },
    avatar: {
        type: String,
        required: true,    
        trim: true
    },
    price:  {
        type: Number,
        required: true,
        trim: true
    },
    categories: {
        type: [String],
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
    if(typeof title !== 'undefined' && title !== null){
        return title.length > 0;
    }
    return false;
}, 'Title cannot be empty');

ArticleSchema.path('avatar').validate(function(avatar) {
    return /\.(jpeg|jpg|gif|png)$/i.test(avatar);
}, 'Is not a valid image');

ArticleSchema.path('price').validate(function(price) {
    if(typeof price !== 'undefined' && price !== null){
        return /^[0-9\.,]+$/.test(price);
    }
    return false;
 }, 'Is not a valid price format');

ArticleSchema.path('categories').validate(function(categories) {
    if(typeof categories !== 'undefined' && categories !== null){
        return categories.length > 0;
    }
    return false;
}, 'Categories cannot be empty');

mongoose.model('Article', ArticleSchema);