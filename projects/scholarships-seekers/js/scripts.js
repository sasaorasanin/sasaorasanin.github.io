$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response.schools, function(i, item) {
            let website = '', contacts = '';
            if (item.description) {
                website = `<a target="_blank" href="${ item.description.includes("http") ? item.description : 'https://' + item.description }">${ item.description }</a>`;
            }
            if (item.id === response.contacts.id) {
                contacts = '<a href="#" data-toggle="modal" data-target=".bd-example-modal-xl">Show</a>';
                $.each(response.contacts.data, function(i, contact) {
                    $('#contacts').append(`<tr>
                        <td data-header="#"><span>${ i+1 }</span></td>
                        <td data-header="Name"><span>${ contact.name }</span></td>
                        <td data-header="Email"><span><a href="mailto:${ contact.email }">${ contact.email }</a></span></td>
                        <td data-header="Sport"><span>${ contact.sport }</span></td>
                        <td data-header="Position"><span>${ contact.position }</span></td>
                    </tr>`);
                });
            }
            $('#data').append(`<tr>
                <td data-header="#"><span>${ i+1 }</span></td>
                <td data-header="Name"><span>${ item.name }</span></td>
                <td data-header="State"><span>${ item.state }</span></td>
                <td data-header="League"><span>${ item.league }</span></td>
                <td data-header="Division"><span>${ item.division }</span></td>
                <td data-header="Website"><span>${ website }</span></td>
                <td data-header="Contacts"><span>${ contacts }</span></td>
            </tr>`);
        });
    });
});