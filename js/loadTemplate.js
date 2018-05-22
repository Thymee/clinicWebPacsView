function loadTemplate(url, callback) {
    $.ajax({
        url: url,
        async : false, 
        success:function(data){
            var parsed = $.parseHTML(data);
            $.each(parsed, function(index, ele) {
                if(ele.nodeName === 'DIV')
                {
                    var element = $(ele);
                    callback(element);
                }
            });
        },
        error:function(er){
            console.log(er);
        }
    });

}
