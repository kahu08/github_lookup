exports.getRepos = function() {
    $.get('https://api.github.com/users/kahu08?access_token=' + apiKey).then(function(response) {
        console.log(response);
    }).fail(function(error) {
        console.log(error.responseJSON.message);
    });
};
