$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response, function(i, item) {
            let website = '';
            if (item.description) {
                website = `<a href="${ item.description.includes("http") ? item.description : 'https://' + item.description }">${ item.description }</a>`;
            }
            $('#data').append(`<tr>
                <td data-header="#"><span>${ i+1 }</span></td>
                <td data-header="Name"><span>${ item.name }</span></td>
                <td data-header="State"><span>${ item.state }</span></td>
                <td data-header="League"><span>${ item.league }</span></td>
                <td data-header="Division"><span>${ item.division }</span></td>
                <td data-header="Website"><span>${ website }</span></td>
                <td data-header="Contacts"><span><a href="#">Show</a></span></td>
            </tr>`);
        });
    });
});