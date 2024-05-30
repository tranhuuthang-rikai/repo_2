$(function(){
  var btn = $('.totop');
  
  $(window).on('load scroll', function(){
    if($(this).scrollTop() > 100) {
      btn.addClass('active');
    }else{
      btn.removeClass('active');
    }
  });
  btn.on('click',function () {
    $('body,html').animate({
      scrollTop: 0
    });
  });

  const agent = window.navigator.userAgent.toLowerCase()
    if (agent.indexOf("msie") != -1) {
      $("body").addClass("ie");
    }
    if (agent.indexOf("trident") != -1) {
      $("body").addClass("ie");
    }

  $('.rulebtn').click(function() {
    if ($('#rule_detail').css('display') == 'none') {
     $('#rule_detail').slideDown('slow');
     $('#rule_box .rulebtn').addClass('open');
    }else{
     $('#rule_detail').slideUp('slow'); 
     $('#rule_box .rulebtn').removeClass('open');
    }
  });

  $('.rulebtn2').click(function() {
    if ($('#rule_detail2').css('display') == 'none') {
     $('#rule_detail2').slideDown('slow');
     $('#rule_box2 .rulebtn2').addClass('open');
    }else{
     $('#rule_detail2').slideUp('slow'); 
     $('#rule_box2 .rulebtn2').removeClass('open');
    }
  });

  $('.modal-open').on('click', function() {
    return false;
  });

  $('.comingsoon a').on('click', function() {
    return false;
  });

  $('.sharebtn').on('click', function() {
    $('.share_open').addClass('show_open');
    $('.movie_share').removeClass('show_open');
    $('#popup').addClass('show_open');
    $('body').css('position','flex');
  });

  $('.popup-close').on('click', function() {
    $('#popup').removeClass('show_open');
  });

  var count = 0;
  var countup = function () {
    if ($('.share_open').hasClass('show_open')) {
      $('.share_open').removeClass('show_open');
      $('.movie_share').addClass('show_open');
    } else {
    }
  }
  setInterval(countup, 600000);

  var scrollTop;
  $(document).on('click', '.modal-overlay', function () {
    $('body').css({
      overflow: 'auto',
      position: '',
      top: ''
    });
    $(window).scrollTop(scrollTop);
  });

  $(document).on('click', '.modal-close', function () {
    $('body').css({
      overflow: 'auto',
      position: '',
      top: ''
    });
    $(window).scrollTop(scrollTop);
  });

  $(".modal-open").click(function() {
    modal.open($(this));
    scrollTop = $(window).scrollTop();
      $('body').css({
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      top: -scrollTop
    });
  });

});

$(document).ready(function(){
  var target = $("#nav1");
  var el = target.offset().top;
  $("#bn_fixed").hide();
  $(window).on("scroll", function() {
    var scroll = $(this).scrollTop();
    if (scroll > el) {
      $("#bn_fixed").fadeIn("fast");
    } else {
      $("#bn_fixed").fadeOut("fast");
    }
    scrollHeight = $(document).height();
    scrollPosition = $(window).height() + $(window).scrollTop();
    footHeight = $("footer").innerHeight();
    if ( scrollHeight - scrollPosition  <= footHeight ) {
      $("#bn_fixed").css({
        "position":"absolute", 
        "bottom": footHeight + 0
      });
    } else { 
      $("#bn_fixed").css({
        "position":"fixed",
        "bottom": "13px" 
      });
    }
  });
});

function checkdiv( obj,id ) {
  if( obj.checked ){
    document.getElementById("checkBox").style.display = "block";
    document.getElementById("checkBox_gray").style.display = "none";
  }
  else {
    document.getElementById("checkBox").style.display = "none";
    document.getElementById("checkBox_gray").style.display = "block";
  }
}

function youtube_defer() {
  var iframes = document.querySelectorAll('.youtube');
  iframes.forEach(function(iframe){
    if(iframe.getAttribute('data-src')) {
      iframe.setAttribute('src',iframe.getAttribute('data-src'));
    }
  });
}
window.addEventListener('load', youtube_defer);

/* YouTube */
function Modal(el) {
  this.option = {
    modalOverlayClass: "modal-overlay",
    modalContentClass: "modal-content",
    modalCloseClass: "modal-close",
  }
}

Modal.prototype = {
  open: function (el) {
    modalObj = this; 
    targetID = el.attr('href'); 
    $target = $(targetID).clone();

    $("body").append('<div class="'+this.option.modalOverlayClass+'"></div>');
    $('.'+this.option.modalOverlayClass).append('<div class="'+this.option.modalContentClass+'"></div>').fadeIn(300);
    $('.'+this.option.modalContentClass).append('<a class="'+this.option.modalCloseClass+'"></a>').fadeIn(300);
    $('.'+this.option.modalContentClass).append($target).fadeIn(300);
    $target.fadeIn();

    $(".modal-overlay").click(function (e) {
      modalObj.close();
    });

    $(".modal-close").click(function (e) {
      modalObj.close();
    });
  },
  close: function () {
    $(".modal-overlay").remove();
    $(".modal-content").remove();
  }
};
var modal = new Modal();

var videoWidth  = '640';
var videoHeight = '360';

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  $('.youtube').each(function(index){
    
    var videoId = $(this).data('video-id');
    var playerId = $(this).attr('id');
    
    player = new YT.Player(playerId, {
      height: videoHeight,
      width: videoWidth,
      videoId: videoId,
    });
  });
}