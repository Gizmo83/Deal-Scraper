var cheerio = require("cheerio");
var request = require("request");

// Making a request for ziprecruiter's junior developer search results. The page's HTML is passed as the callback's third argument
request("https://www.ziprecruiter.com/candidate/search?search=junior+developer&location=West+Covina%2C+CA", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each div with the "job_content" class
  // (i: iterator. element: the current element)
  $("div.job_content").each(function(i, element) {
    //console.log(i);
    //console.log(element);
    // Save the text of the element in a "title" variable
    var title = $(element).children().children("h2.job_title").children("span.just_job_title").text();
    var company = $(element).children("p.job_org").children("a.name").text();
    var description = $(element).children("p.job_snippet").children().text();
    var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      company: company,
      title: title,
      description: description,
      link: link
    });
  });
  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});