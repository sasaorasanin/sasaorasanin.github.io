$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response, function(item) {
            $('#data').append(`<tr>
                <td>${ item.id }</td>
                <td>${ item.name }</td>
                <td>${ item.state }</td>
                <td>${ item.league }</td>
                <td>${ item.division }</td>
                <td><a href="${ item.description.includes('http') ? item.description : 'https://' + item.description }">${ item.description }</a></td>
                <td>${ item.slug }</td>
            </tr>`);
        });
    });
});