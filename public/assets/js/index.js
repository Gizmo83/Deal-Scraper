$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "POST",
        url: "/favorite/" + thisId
    })
    M.toast({html: 'Added to Favorites'})
})

$("#scrape-btn").on("click", function() {
    $.get("/scrape", function(data) {
        location.reload();
    })
})

// Favorites Page
$(document).ready(function() {
    $('.modal').modal();
});

// Add note button, populate modal content
$(".note").on("click", function() {

    $("#title").empty();
    $("#company").empty();

    var thisId = $(this).attr("data-id");
    //console.log(thisId);
    $.ajax({
        method: "GET",
        url: "/posts/" + thisId
    })
    .then(function(data) {
        //console.log(data);
        $("#title").append("Add a note for " + data.title);
        $("#company").append(data.company);
        $("#save-note").attr("data-id", data._id);

        if (data.note) {
            // Place the body of the note in the body textarea

            $("label").empty();
            $("textarea").val(data.note.body);
        }
    });
});

// Save note button
$("#save-note").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/posts/" + thisId,
        data: {
            body: $("textarea").val()
        }
    })
    .then(function(data) {
        //console.log(data);
        location.reload();
    })
})


// Delete favorite
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "POST",
        url: "/favorite/delete/" + thisId
    })
    location.reload();
});