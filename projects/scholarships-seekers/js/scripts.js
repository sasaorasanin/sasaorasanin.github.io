$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        console.log(response);
        $('#data').append(`<tr>
            <td>${ response.id }</td>
            <td>${ response.name }</td>
            <td>${ response.state }</td>
            <td>${ response.league }</td>
            <td>${ response.division }</td>
            <td><a href="${ response.description }">${ response.description }</a></td>
            <td>${ response.slug }</td>
        </tr>`);
    });
});