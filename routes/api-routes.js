var datab = require("../models");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Routes

module.exports = function (app) {
    // Scraping Route
    app.get("/scrape", function(req, res) {
        // Making a request for ziprecruiter's "junior developer" search results. The page's HTML is passed as the callback's third argument
        request("https://www.ziprecruiter.com/candidate/search?search=junior+developer&location=West+Covina%2C+CA", function(error, response, html) {
        
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);
        
        // With cheerio, find each div with the "job_content" class
        // (i: iterator. element: the current element)
        $("div.job_content").each(function(i, element) {
            //console.log(i);
            //console.log(element);
            var result = {};
            // Save the text of the element in a "title" variable
            result.title = $(element).children().children("h2.job_title").children("span.just_job_title").text();
            result.company = $(element).children("p.job_org").children("a.name").text();
            result.description = $(element).children("p.job_snippet").children().text().trim();
            result.link = $(element).children().attr("href");
            result.jobId = $(element).children().children("h2.job_title").children("span.just_job_title").attr("data-job-id");
            result.favorite = false;
            
            // Create a new Post using the `result` object built from scraping
            datab.Post.create(result)
            .then(function(dbPost) {
                // View the added result in the console
                console.log(dbPost);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                return res.json(err);
            });
        });
        
        // Send a "Scrape Completge" message to the browser
        res.send("Scrape Complete")
        });
    })


    // Route for getting all Posts from db
    app.get("/", function(req, res) {
        datab.Post.find({})
        .then(function(dbPost) {
            //console.log(dbPost);
            //res.json(dbPost);
            res.render("index", { posts: dbPost });
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Route for grabbing a specific Post by id, populate it with it's note
    app.get("/posts/:id", function(req,res) {
        datab.Post.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbPost) {
            res.json(dbPost);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Route for saving/updating a Post's associated note
    app.post("/posts/:id", function(req, res) {
        console.log(req.body);
        datab.Note.create(req.body)
            .then(function(dbNote) {
                return datab.Post.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbPost) {
                res.json(dbPost);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Route for getting all favorites from db
    app.get("/favorite", function(req, res) {
        datab.Post.find({
            favorite: true
        })
        .then(function(dbFavorites) {
            res.render("favorites", {posts: dbFavorites})
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Route for adding a post to favorites
    app.post("/favorite/:id", function(req, res) {
        datab.Post.findOneAndUpdate({ _id: req.params.id }, { favorite: true })
        .then(function(dbpost) {
            res.json(dbpost);
        })
        .catch(function(err) {
            res.json(err);
        });
    });
    
    app.post("/favorite/delete/:id", function(req, res) {
        datab.Post.findOneAndUpdate({ _id: req.params.id }, { favorite: false })
        .then(function(dbpost) {
            res.json(dbpost);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

}