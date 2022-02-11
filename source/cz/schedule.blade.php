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
<link rel="stylesheet" href="{{ mix('css/subsite.css', 'assets/build') }}">
@endsection

@section('title')
<title>Sessions - Red Hat Czech Open House</title>
@endsection


@section('body')
<header class="masthead">
	<nav class="mb-1 navbar navbar-expand-lg navbar-dark fixed-top masthead">
		<span class="nav-brand"><a href="/cz"><img src="/assets/images/oh-logo-reverse.svg"></a></span>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMobile"
		    aria-controls="navbarMobile" aria-expanded="false" aria-label="Toggle navigation">
		    <span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarMobile">
			<ul class="navbar-nav ml-auto pr-5">
				<li class="nav-item active px-3">
					<a href="/cz/#about" class="nav-link">About</a>
				</li>
    			<li class="nav-item active px-3">
					<a href="/cz/#registration" class="nav-link">Registration</a>
				</li>
				<li class="nav-item active px-3">
					<a href="#" class="nav-link underline local">Schedule</a>
				</li>
				<li class="nav-item active px-3">
					<a href="/cz/speakers" class="nav-link local">Speakers</a>
				</li>
<!--				<li class="nav-item active px-3">
					<a href="/cz/venue" class="nav-link local">Venue</a>
				</li> -->
			</ul>
		</div>
	</nav>
</header>

<section style="margin-top: 56px">
<iframe src="/cz/schedule-load/index.html" width="100%" style="border: 0px; min-height: 100vh"></iframe>
</section>

@endsection

@include('_layouts.footercz')
