var apiKey = require('./../.env').apiKey;

$(document).ready(function() {
    $('#lookupid').click(function() {
        var city = $('#lookup').val();
        $('#lookup').val("");
        $('.showWeather').text("The city you have chosen is " + city + ".");
        $.get('https://api.github.com/users/kahu08?access_token=' + apiKey).then(function(response) {
            console.log(response);
        });
    });
});
