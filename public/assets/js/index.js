$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "POST",
        url: "/favorite/" + thisId
    })
})