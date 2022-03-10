@extends('_layouts.page')

@section('social')
<meta property="og:title" content="Red Hat Czech Open House, Brno - Czechia">
<meta property="og:site_name" content="Red Hat Czech Open House">
<meta property="og:description" content="Red Hat Czech Open House is the annual, free, virtual event organized by Red Hat Czech associates who are keen to present their work and experience and share Red Hat culture and values.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://openhouse.redhat.com">
<meta property="og:image" content="https://openhouse.redhat.com/assets/images/oh-social.png">
<meta property="twitter:image" content="https://openhouse.redhat.com/assets/images/oh-social.png">
@endsection

@section('css')
<link rel="stylesheet" href="{{ mix('css/site.css', 'assets/build') }}">
@endsection

@section('title')
<title>Red Hat Open House 2022</title>
@endsection


@section('body')
<header class="masthead min-vh-100">
	<nav class="mb-1 navbar navbar-expand-lg navbar-dark fixed-top">
		<span class="nav-brand"><a href="#" class="home"><img src="/assets/images/oh-logo-reverse.svg" alt="Open House logo"></a></span>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMobile"
		    aria-controls="navbarMobile" aria-expanded="false" aria-label="Toggle navigation">
		    <span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarMobile">
			<ul class="navbar-nav ml-auto pr-5">
				<li class="nav-item active px-3">
					<a href="#about" class="nav-link local">About</a>
				</li>
                <li class="nav-item active px-3">
                    <a href="#registration" class="nav-link local">Registration</a>
                </li>
				<li class="nav-item active px-3">
					<a href="/cz/schedule" class="nav-link local">Schedule</a>
				</li>
<!--				<li class="nav-item active px-3">
					<a href="/cz/venue" class="nav-link local">Venue</a>
				</li> -->
			</ul>
		</div>
	</nav>
	<div class="row mr-0 mt-5" style="height: 85%">
        <div class="col-lg-1 pt-5 border-right text-center pr-0">
			<a href="mailto:openhouse@redhat.com" target="_blank" title="Mail"><img src="/assets/images/mail.svg" alt="Mail" class="social-icon"></a>
			<a href="https://www.facebook.com/RedHatCzech" target="_blank" title="Facebook"><img src="/assets/images/facebook.svg" alt="Facebook" class="social-icon"></a>
			<a href="https://twitter.com/redhatcz" target="_blank" title="Twitter"><img src="/assets/images/twitter.svg" alt="Twitter" class="social-icon"></a>
            <a href="https://www.instagram.com/redhatjobs/" target="_blank" title="Instagram"><img src="/assets/images/instagram.svg" alt="Instagram" class="social-icon"></a>			
			<a href="https://www.youtube.com/c/redhatjobs/" target="_blank" title="YouTube"><img src="/assets/images/youtube.svg" alt="YouTube" class="social-icon"></a>
		</div>
		<div class="col-lg-10 h-100 px-0 mx-auto text-center text-lg-left">
			<div class="heading-text-h1 mont-400 px-5 px-lg-0 pt-5">
				Red Hat Czech Open House
			</div>
			<div class="heading-text-h1 mont-400 px-5 px-lg-0 text-red">
				April 13, 2022
			</div>
            <a class="heading-text-h1 mont-400 px-5 text-red local-nav mt-5 d-inline d-lg-inline-block border">Virtual event</a><br>
		</div>
	</div>
</header>
<section id="about" class="mx-auto col-lg-10">
	<div class="row mt-4 py-5">
		<div class="col-lg-4 mx-5 mb-5 text-center">
			<img src="/assets/images/oh-image.png" class="mw-100" alt="Open House image asset">
		</div>
		<div class="col-lg-6 px-5">
			<h1 class="rhd-700 underline pb-4">About Open House</h1>
			<div class="rhd-400">
                <p>Red Hat Czech Open House is the annual, free, virtual event organized by Red Hat Czech associates who are keen to present their work and experience and share Red Hat culture and values.</p>

				<p>While we are disappointed that we won’t be able to see you all in person again, we are glad to be back as a virtual event.</p>

                <p>There is no admission or ticket charge for the Red Hat Czech Open House. However, you are required to complete a free registration.</p>
			</div>
	</div>
</section>
<!--
 <section id="registration" class="mx-auto col-lg-10">
    <div class="row mt-4 py-5 px-5">
            <h1 class="rhd-700 underline pb-4 w-100">Registration</h1>
            <div class="rhd-400">
                <p>Join more than 30 of the Red Hat Czech brightest minds in open source, hybrid cloud, and open culture. Register to one of three streams to learn more about technologies and the Red Hat community.</p>
            </div>
            <div class="rhd-400 w-100 mb-5 text-center">
                <div class="heading-text pt-1 mt-5 d-inline-block">
                    <a href="https://primetime.bluejeans.com/a2m/register/dsdzkqst" target="_blank" class="border p-3 h2 mont-700 mx-5" style="border-width: 3px !important;">Life At Red Hat</a><br>
                </div>
                <div class="heading-text pt-1 mt-5 d-inline-block">
                    <a href="https://primetime.bluejeans.com/a2m/register/agsaqtyw" target="_blank" class="border p-3 h2 mont-700 mx-5" style="border-width: 3px !important;">Tech Talks</a><br>
                </div>
                <div class="heading-text pt-1 mt-5 d-inline-block">
                    <a href="https://primetime.bluejeans.com/a2m/register/jpfyrrjc" target="_blank" class="border p-3 h2 mont-700 mx-5" style="border-width: 3px !important;">Bughunting</a><br>
                </div> 
            </div>
    </div>
</section>
-->
<section class="col-12 px-0" style="height: 450px;" id="venue">
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2605.4399852071992!2d16.57424988490214!3d49.230146822801615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x549d796a7eafb4ec!2sRed%20Hat%20Czech!5e0!3m2!1sen!2scz!4v1615551472943!5m2!1sen!2scz"  width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
</section>
@endsection

@include('_layouts.footercz')
