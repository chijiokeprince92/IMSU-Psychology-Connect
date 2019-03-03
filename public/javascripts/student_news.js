$(document).ready(function() {
    $('#cousin{{this.id}}').click(function() {
        $('#drake{{this.id}}').toggle("slow");
        $('#cousin{{this.id}}').toggle("slow");
        $('#close{{this.id}}').toggle("slow");
    });
    $('#close{{this.id}}').click(function() {
        $('#drake{{this.id}}').toggle("slow");
        $('#cousin{{this.id}}').toggle("slow");
        $('#close{{this.id}}').toggle("slow");
    });
});