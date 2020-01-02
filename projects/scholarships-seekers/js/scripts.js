$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response, function(i, item) {
            let website = '';
            if (item.description) {
                website = `<a href="${ item.description.includes("http") ? item.description : 'https://' + item.description }">${ item.description }</a>`;
            }
            $('#data').append(`<tr>
                <td data-header="#">${ i+1 }</td>
                <td data-header="Name">${ item.name }</td>
                <td data-header="State">${ item.state }</td>
                <td data-header="League">${ item.league }</td>
                <td data-header="Division">${ item.division }</td>
                <td data-header="Website">${ website }</td>
                <td data-header="Contacts"><button class="btn btn-info btn-sm float-right">Show</button></td>
            </tr>`);
        });
    });
});