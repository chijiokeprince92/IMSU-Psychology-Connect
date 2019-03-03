$('document').ready(function() {
    $(function() {
        var socket = io();
        $('#formy').submit(function(event) {
            event.preventDefault();
            var commentId = $('#comment-id').val();
            var msg = $('#comment').val();
            $.post(
                '/studentcomments/' + commentId, {
                    comment: msg
                },
                function(err, response) {
                    if (err) {
                        console.log(err, 'error')
                    } else if (response) {
                        console.log(response, 'error')
                    }
                });

            $('#comment').val('');
        });
        socket.on('chat_message', function(msg) {
            console.log(msg, 'Message')
            $('#messages').append($('<div class="container-fluid"><div class="row"></div></div>').html('<div class="col-12 col-md-6 col-lg-4"><li class="card"><div class="col-12"><p><b>You</b></p></div><div class="col-12"><p>' + msg + '</p></div></li></div>' + '<br>'));
        });
    });
});