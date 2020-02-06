$(document).ready(function() {
    $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php', function(response) {
        $.each(response.schools, function(i, item) {
            let website = '';
            if (item.description) {
                website = `<a target="_blank" href="${ item.description.includes("http") ? item.description : 'https://' + item.description }">${ item.description }</a>`;
            }
            $('#data').append(`<tr>
                <td data-header="#"><span>${ i+1 }</span></td>
                <td data-header="Name"><span>${ item.name }</span></td>
                <td data-header="State"><span>${ item.state }</span></td>
                <td data-header="League"><span>${ item.league }</span></td>
                <td data-header="Division"><span>${ item.division }</span></td>
                <td data-header="Website"><span>${ website }</span></td>
                <td data-header="Contacts"><span><a href="#" class="show-contacts" data-id="${ item.id }">Show</a></span></td>
            </tr>`);
        }).fail(function(err) { alert( err.message ); });
    });
    
    $(document).on('click','.show-contacts', function(e) {
        e.preventDefault();
        $.get('https://www.sasaorasanin.com/projects/scholarships-seekers/api.php?id=' + $(this).data("id"), function(response) {
            $('#contacts').html('');
            $.each(response.contacts, function(i, contact) {
                $('#contacts').append(`<tr>
                    <td data-header="#"><span>${ i+1 }</span></td>
                    <td data-header="Name"><span>${ contact.name }</span></td>
                    <td data-header="Email"><span><a href="mailto:${ contact.email }">${ contact.email }</a></span></td>
                    <td data-header="Sport"><span>${ contact.sport }</span></td>
                    <td data-header="Position"><span>${ contact.position }</span></td>
                </tr>`);
            });
            $('.bd-example-modal-xl').modal('show');
        }).fail(function(err) { alert( err.message ); });;
    });
});
