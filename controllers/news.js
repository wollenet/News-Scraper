var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require("bluebird");

mongoose.Promise = Promise;

var article = require("../models/article");
var Comments = require("../models/comments");

var url = "http://www.goodnewsnetwork.org/latest-news/";

router.get('/test', function(req, res) {
    
    request(url, function(error, response, html) {
        
        var $ = cheerio.load(html);
		var result = [];
		$(".span6").each(function(i, element) {
			var titles = $(element).find("a").find("img").attr("titles");
			var story = $(element).find("a").attr("href");
			var imgLink = $(element).find("a").find("img").attr("src");
			var textsummary = $(element).find(".td-post-text-excerpt").text();
			textsummary = textsummary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
			result.push({ 
				Titles: titles,
				Story: story,
				Link: imgLink,
				textSummary: textsummary
			});
		});
		console.log(result);
		res.send(result);
    });
});


router.get('/', function(req, res){
	res.render('index');
});

router.get('/scrape', function(req, res){
    request(url, function(error, response, html) {	
        var $ = cheerio.load(html);
		var result = [];

		$(".span6").each(function(i, element) {
		    var titles = $(element).find("a").find("img").attr("titles");
		    var imgLink = $(element).find("a").find("img").attr("src");
		    var story = $(element).find("a").attr("href");
		    var textsummary = $(element).find(".td-post-text-excerpt").text();
		    textsummary = textsummary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
			result[i] = ({ 
				titles: titles,
				imgLink: imgLink,
				story: story,
				textsummary: textsummary
			});	

			article.findOne({'titles': titles}, function(err, articleRecorded) {
				if(err) {
					console.log(err);
				} else {
					if(articleRecorded == null) {
						article.create(result[i], function(err, record) {
							if(err) throw err;
							console.log("Record Added");
						});
					} else {
						console.log("No Record Added");
					}					
				}
			});	
		});
    });	
});


router.get('/article', function(req, res){
	article.find().sort({ createdAt: -1 }).exec(function(err, data) { 
		if(err) throw err;
		res.json(data);
	});
});


router.get('/comments/:id', function(req, res){
	Comments.find({'articleId': req.params.id}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}	
	});
});


router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id+' '+req.body.comment);
	Comments.create({
		articleId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Comment Added");
		}
	});
});


router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comments.remove({'_id': req.params.id}).exec(function(err, data){
		if(err){
			console.log(err);
		} else {
			console.log("Comment deleted");
		}
	})
});

module.exports = router;