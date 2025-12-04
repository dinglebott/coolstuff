$(window).on("load", function() {
    $("body").attr("class", "");
});

$(".button").mouseenter(function() {
    $(this).css("background-color", "rgb(20, 30, 100)");
});

$(".button").mouseleave(function() {
    $(this).css("background-color", "");
});