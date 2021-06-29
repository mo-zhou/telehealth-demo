
// add invitation button functionality

 $('#invite-button').on('click', function () {
    $('.center').show();
    $(this).hide();
})

$('#close').on('click', function () {
    $('.center').hide();
    $('#invite-button').show();
})

$('#submit').on('click', function () {
    $('.center').hide();
    $('#invite-button').show();
})


$(document).ready(function() {
    // bind form using ajaxForm
    $('#phoneNumberForm').ajaxForm({
      dataType:  'json',
      success:   sendSMS
    });
});

function sendSMS(data) {

    alert(data.message); // send server response back to a pop up window
}