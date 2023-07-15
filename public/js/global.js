$(document).ready(function(){
	console.log("Front end script succesful :)");

    $(".wrapper").hide();

    setTimeout(function() { 
        $(".wrapper").fadeIn("slow");
    }, 200);
});


