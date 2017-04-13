'use strict';

//Same thing as document.ready
$(function() {

    $("#loginForm").on("submit", function() {
        event.preventDefault();
        alert("Hi");
    });


});