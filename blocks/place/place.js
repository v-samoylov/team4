$('.check-in').each(function () {
    $(this).click(function () {
        var name = $(this).data('name');
        console.log(name);// quest#place
    });
});
