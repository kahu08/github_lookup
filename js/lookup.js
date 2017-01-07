$(document).ready(function() {
    $('#lookup-form').submit(function(event) {
        event.preventDefault();
        var goal = $('#goal').val();
        var output = lookUp(goal);
        output.forEach(function(element) {
            $('#solution').append("<li>" + element + "</li>");
        });
    });
});
