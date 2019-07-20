
$.post({
    url: '/proxy/bd',
    data: {
        name: 'sss'
    },
    success: function(res) {
        console.log(res);
    }
});