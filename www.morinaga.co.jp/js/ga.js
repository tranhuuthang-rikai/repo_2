var _gaq = _gaq || [];

if (("http:" === document.location.protocol)){

_gaq.push(['_setAccount', 'UA-34904702-1']);
_gaq.push(['_trackPageview']);

} else {

_gaq.push(['_setAccount', 'UA-34904702-2']);
_gaq.push(['_trackPageview']);

}

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

})();


(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T25GSM');

if (window.jQuery){
  //外部サイトへの流出を計測
  window.jQuery('a[href^="http"]').click(function(){
    var href = window.jQuery(this).attr("href");
    if (href.indexOf("//www.morinaga.co.jp/") < 0){
      _gaq.push(['_trackPageview',"/_virtual_/" + href]);
    }
  });
}
