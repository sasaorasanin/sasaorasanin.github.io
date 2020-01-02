$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response, function(i, item) {
            let website = '';
            if (item.description) {
                website = `<a href="${ item.description.includes("http") ? item.description : 'https://' + item.description }">${ item.description }</a>`;
            }
            $('#data').append(`<tr>
                <td data-header="<span class='xs-header'>#: </span>"><span>${ i+1 }</span></td>
                <td data-header="<span class='xs-header'>Name: </span>"><span>${ item.name }</span></td>
                <td data-header="<span class='xs-header'>State: </span>"><span>${ item.state }</span></td>
                <td data-header="<span class='xs-header'>League: </span>"><span>${ item.league }</span></td>
                <td data-header="<span class='xs-header'>Division: </span>"><span>${ item.division }</span></td>
                <td data-header="<span class='xs-header'>Website: </span>"><span>${ website }</span></td>
                <td data-header="<span class='xs-header'>Contacts: </span>"><span><a href="#">Show</a></span></td>
            </tr>`);
        });
    });
});