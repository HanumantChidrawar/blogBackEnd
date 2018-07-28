//const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../library/timeLib');
const check = require('./../library/checkLib');

//importing the responseLibrary
const response = require('./../library/responseLib');
const logger = require('./../library/loggerLib');

//importing blog model here
const BlogModel = mongoose.model('Blog');

let getAllBlogs = (req, res) => {

    BlogModel.find()
        .select('-__v -_d')
        .lean()
        .exec((err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: getAllBlog', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:getAllBlog', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog Found Successfully', 'Blog Controller:getAllBlogs', 5);
                let apiResponse = response.generate(false, 'All Blogs Details Found', 200, result);
                res.send(apiResponse);
            }
        });
}//end getAllBlogs

let viewByBlogId = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {
        let apiResponse = response.generate(true, 'blogId is missing', 403, null);
        res.send(apiResponse);
    }
    else {

        BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByBlogId', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:viewBlogById', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog Found Successfully', 'Blog Controller:viewByBlogId', 5);
                let apiResponse = response.generate(false, 'Blog Details Found', 200, result);
                res.send(apiResponse);
            }

        });
    }
}//end viewByBlogId

let viewByAuthor = (req, res) => {

    if (check.isEmpty(req.params.author)) {

        console.log('author should be passed')
        let apiResponse = response.generate(true, 'author is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.find({ 'author': req.params.author }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByAuthor', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:ViewBlogByAuthor', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog Found Successfully', 'Blog Controller:viewByAuthor', 5);
                let apiResponse = response.generate(false, 'All Blogs Details Found', 200, result);
                res.send(apiResponse);
            }

        });
    }
}//end viewByAuthor

let viewByCategory = (req, res) => {

    if (check.isEmpty(req.params.category)) {
        let apiResponse = response.generate(true, 'CategoryId is missing', 403, null)
        res.send(apiResponse)
    } else {
        BlogModel.find({ 'category': req.params.category }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: viewByCategory', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:ViewByCategory', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog Found Successfully', 'Blog Controller:viewByCategory', 5);
                let apiResponse = response.generate(false, 'All Blogs Details Found', 200, result);
                res.send(apiResponse);
            }

        });
    }
}//end viewByCategory

let deleteBlog = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.deleteOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: deleteBlog', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:deleteBlog', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog Found Successfully', 'Blog Controller:deleteBlog', 5);
                let apiResponse = response.generate(false, 'Blog Found & Deleted', 200, result);
                res.send(apiResponse);
            }

        });
    }
}//end deleteBlog

let editBlog = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);

        BlogModel.update({ 'blogId': req.params.blogId }, options, { multi: true }).exec((err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: editBlog', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:editBlog', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, null);
                res.send(apiResponse);
            } else {
                logger.info('Blog edited Successfully', 'Blog Controller:editBlog', 5);
                let apiResponse = response.generate(false, 'Blog Found & Edited', 200, result);
                res.send(apiResponse);
            }

        });
    }
}//end editBlog

let createBlog = (req, res) => {

    var today = Date.now();
    let blogId = shortid.generate();

    let newBlog = new BlogModel({

        blogId: blogId,
        titlte: req.body.title,
        description: req.body.description,
        bodyHtml: req.body.blogBody,
        views: req.body.views,
        isPublished: true,
        category: req.body.category,
        author: req.body.fullName,
        created: today,
        lastModified: today

    });//end new BlogModel

    let tags = (req.body.tags != undefined && req.body.tags != ""  && req.body.tags != null) ? req.body.tags.split(',') : [];
    newBlog.tags = tags;
    console.log(newBlog.tags);

    newBlog.save((err, result) => {

        if (err) {
            logger.error(err.message, 'Blog Controller: createBlog', 10);
            let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
            res.send(apiResponse);
        } else {
            logger.info('Blog created Successfully', 'Blog Controller:createBlog', 5);
            let apiResponse = response.generate(false, 'Blog Created Successfully', 200, result);
            res.send(apiResponse);
        }

    });// end newBlog save() method

}//end createBlog

let increaseBlogView = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {
        BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

            if (err) {
                logger.error(err.message, 'Blog Controller: increaseBlogView', 10);
                let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.info('No Blog Found', 'Blog Controller:increaseBlogView', 5);
                let apiResponse = response.generate(true, 'No Blog found', 404, err);
                res.send(apiResponse);
            } else {
                result.views += 1;
                result.save((err, result) => {
                    if (err) {
                        logger.error(err.message, 'Blog Controller: increaseBlogView', 10);
                        let apiResponse = response.generate(true, 'Failed to find the Blog Details', 500, err);
                        res.send(apiResponse);
                    }
                    else {
                        logger.info('Blog View Increased Successfully', 'Blog Controller:increaseBlogView', 5);
                        let apiResponse = response.generate(false, 'Blog Created Successfully', 200, result);
                        res.send(apiResponse);
                    }
                });//end save
            }
        });
    }
}//end increaseBlogView

module.exports = {

    getAllBlogs: getAllBlogs,
    viewByBlogId: viewByBlogId,
    viewByAuthor: viewByAuthor,
    viewByCategory: viewByCategory,
    deleteBlog: deleteBlog,
    editBlog: editBlog,
    createBlog: createBlog,
    increaseBlogView: increaseBlogView

}