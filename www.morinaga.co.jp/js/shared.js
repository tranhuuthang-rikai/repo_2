;(function($) {
	var root = document.documentElement;
	var _IE8 = (typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined") ? true :false;
	root.className = root.className.replace(/\bno[-_]?js\b/ig, '') + ' js';
	if(_IE8){
	}



	$.extend({
		rollOver : function(){
			var preLoad = new Object();
			$(".js-hover").not("[src*='_ov']").each(function(){
				var imgSrc = this.src;
				var imgOver = imgSrc.replace(/^(.+)(\.[a-z]+)$/, "$1_ov$2");
				preLoad[this.src] = new Image();
				preLoad[this.src].src = imgOver;
				$(this).hover(
					function (){
						this.src = imgOver;
					},
					function (){
						this.src = imgSrc;
					}
				);
			});
			$(".js-hoverFilter").hover(function(){
				$(this).fadeTo(100,0.7);
			},
			function(){
				$(this).fadeTo(100,1.0);
			});
		},
		smoothScroll : function (){
			var $body = $("body")
			;var speed = 500;
			$('a[href^="#"]').not('.js-noScroll a, .js-noScroll, .js-lightBox, .selected').click(function() {
				var href= $(this).attr("href");
				var target = $(href == "#" || href == "" ? 'html' : href);
				var position = target.offset().top;
				
				if($body.hasClass("is-headerFixed")){
					if(position != 0){
						position -= 40;
					}
				}
				$('body, html').animate({scrollTop:position}, speed, 'swing');
				return false;
			});

			if($body.hasClass("is-headerFixed")){
				var _hash = location.hash;
				var  anchorFlg = $(_hash).offset();
				if(anchorFlg != null){
					var anchorPosition = anchorFlg.top-40;
					$('body, html').animate({scrollTop:anchorPosition}, 5, 'swing');
				}
			}
		},
		gnavHover :function(){
			
			var sugestFlg = false;
			var $sugest;

			$(window).on('load',function(){
				$sugest = $("#SS_Frame2");
				$sugest.hover(
					function(){
						sugestFlg = true;
					},
					function(){
						sugestFlg = false;
						//$this.removeClass("is-hover");
					}
				);
			});
			$(".globalNav__item").each(function(i){
				var $this = $(this);
				var $i = i;
				var hoverFlg = false;
				var hoverTimer;
				var $subNav = $this.find(".globalSubNav");
				$this.hover(
					function(){
						if($subNav[0]){
							hoverFlg = true;
							hoverTimer = setTimeout(function(){
							if(hoverFlg) $subNav.stop(true, true).fadeIn("fast");
						}, 50 );

							//subNav.hide().stop(true, true).delay(200).fadeIn("fast");
						}
						$this.addClass("is-hover");
					},
					function() {
						hoverFlg = false;
						hoverTimer = setTimeout(function(){
							if(hoverFlg==false && sugestFlg == false) $subNav.stop(true, true).fadeOut("fast");
						}, 200 );
						$this.removeClass("is-hover");
					}
				);
			});
			$(".l-wrapper").click(function () {
				if(sugestFlg == false) $(".globalSubNav").stop(true, true).fadeOut("fast");
			});
		},
		gnavFixed :function(){
			var $body = $("body");
			if($body.hasClass("is-headerFixed")){
				var $window = $(window);
				var $globalHeader = $(".globalHeader");
				//var $globalNavTop =  $globalHeader.find(".globalNav__inner").offset().top;
				var $globalNavTop =  $globalHeader.height();

				$window.scroll(function(){
					var position = $window.scrollTop();
					if(position >= $globalNavTop){
						$body.addClass("is-headerFixed--on");
						$globalHeader.addClass("is-shortHeader");
					}else {
						$globalHeader.removeClass("is-shortHeader");
						$body.removeClass("is-headerFixed--on");
					}

				});
			}
		}
	});

  function sharedInit (){
		$.rollOver();
		$.smoothScroll();
		$.gnavHover();
		$.gnavFixed();

		function pageTopFix() {
			var bottombar = $('.globalFooter').offset().top - $(window).height();
			// スクロールトップの位置が「footer」よりも値が小さければ、ページトップ固定
			if($(window).scrollTop() < bottombar)
				$('#toPageTop').addClass("fixBottom");
			// ページトップ固定を解除
			else
				$('#toPageTop').removeClass("fixBottom");
		}
			// ページトップの固定基準位置（フッタ）
		$(window).scroll(function(){
			pageTopFix();
		});
		$(window).resize(function() {
			pageTopFix();
		});
  }

	$(function(){
    sharedInit();
	});
  window.sharedInit = sharedInit;
})(jQuery);
