$(document).ready(function(){
	$(".nav-link.local, .local-nav a, a.local-nav").click(function(event){
		if(this.hash !== ""){
			event.preventDefault();
			var hash = this.hash;
			$("html,body").animate({
				scrollTop: $(hash).offset().top - $('.navbar.fixed-top').outerHeight()
			}, 800, function(){
				history.pushState(null, null, hash);
			});
		}
	});
	$(window).scroll(function() {
		if ($(this).scrollTop() >= (window.innerHeight*0.15)) {
			$('#return-to-top').fadeIn(500);
		} else {
			$('#return-to-top').fadeOut(300);
		}
	});
	$('#return-to-top, .home').click(function() {
		$('body,html').animate({
			scrollTop : 0         
		}, 500);
	});
});
