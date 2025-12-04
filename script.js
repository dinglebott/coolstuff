//code samples display
$("#html").on("mousemove click", function(event) {
    if ($(window).width() >= 650) {
        $("#htmlSample").css({
            "left": event.pageX + 10,
            "top": event.pageY - 200,
            "display": "block"
        });
    } else {
        $("#htmlSample").css({
            "width": "22.5rem",
            "left": 0,
            "top": event.pageY + 10,
            "display": "block"
        });
    }
});
$("#html").mouseleave(function() {
    $("#htmlSample").css({
        "display": "none"
    });
});
$("#css").on("mousemove click", function(event) {
    if ($(window).width() >= 650) {
        $("#cssSample").css({
            "left": event.pageX + 10,
            "top": event.pageY - 200,
            "display": "block"
        });
    } else {
        $("#cssSample").css({
            "width": "22.5rem",
            "left": 0,
            "top": event.pageY + 10,
            "display": "block"
        });
    }
});
$("#css").mouseleave(function() {
    $("#cssSample").css({
        "display": "none"
    });
});
$("#js").on("mousemove click", function(event) {
    if ($(window).width() >= 650) {
        $("#jsSample").css({
            "left": event.pageX + 10,
            "top": event.pageY - 200,
            "display": "block"
        });
    } else {
        $("#jsSample").children("p").text("The JavaScript that makes the tabs below interactive");
        $("#jsSample").css({
            "width": "22.5rem",
            "left": 0,
            "top": event.pageY + 10,
            "display": "block"
        });
    }
});
$("#js").mouseleave(function() {
    $("#jsSample").css({
        "display": "none"
    });
});

//bind tab info
$("#space").data({
    "link": "space/index.html",
    "focusBg": "linear-gradient(rgba(0, 0, 0, 0.4)), url(assets/space_page.jpg)"
});

//page tab behaviour
let enteredTab = false;
$(".tab").on("mouseenter click", function() {
    //tab expanded by css :hover
    //focus bg
    $(this).css({
        "background-image": $(this).data("focusBg")
    });
    //fade in desc, callback set enteredTab = true
    $(this).children("p").fadeIn(200, function() {
        enteredTab = true;
    });
});

$(".tab").mouseleave(function() {
    enteredTab = false;
    //tab minimised by css :hover
    //unfocus bg
    $(this).css({
        "background-image": ""
    });
    //fade out desc
    $(this).children("p").fadeOut(200);
});

$(".tab").click(function() {
    if (enteredTab) {
        location.href = $(this).data("link");
    }
});