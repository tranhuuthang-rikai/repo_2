

var eventPos=0.75;

$(function(){


    $(".scIn").each(function(){
        this.isScrillIn=false;
        this.open=function(){
            if(!this.isScrillIn){
                this.isScrillIn=true;
                $(this).addClass("move");
            }
        }
    })


    $(window).bind("scroll",scrollIn);
    scrollIn();

})


function scrollIn(){
    var sct=$(window).scrollTop();
    $(".scIn").each(function(){
        var y=$(this).offset().top;
        var h=window.innerHeight;
        if(sct>y-h*eventPos || sct+h >= $("body").height()) this.open();
    });

}


