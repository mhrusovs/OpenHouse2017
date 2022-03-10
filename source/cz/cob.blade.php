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
<title>Code of behavior - Red Hat Czech Open House</title>
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
					<a href="/cz/schedule" class="nav-link underline local">Schedule</a>
				</li>
<!--				<li class="nav-item active px-3">
					<a href="/cz/venue" class="nav-link local">Venue</a>
				</li> -->
			</ul>
		</div>
	</nav>
</header>

<section style="margin-top: 56px">
	<div class="row">
        <div class="col-lg-7 mx-auto mt-5"> 
			<div class="row">
				<h1 class="mx-5 rhd-700">Code of behavior</h1>
			</div>

			<div class="row">
				<div class="mx-5  mt-4 rhd-400">
					<h3 class="rhd-700 mt-3">Our expectations</h3>
			        <p>Red Hat values collaboration and community. We want our virtual experience to provide an opportunity for all participants (including staff, speakers, presenters, attendees, sponsors, and guests) to collaborate, learn, participate, and network in an environment that is productive and respectful. We expect participants to be courteous and act professionally, and to interact and communicate in ways that are appropriate for a professional audience from diverse backgrounds.</p>

					<p>Behaviors inconsistent with these expectations include (but are not limited to):</p>
					<ul>
					  <li>Conduct, language, or other action inappropriate for a professional setting that negatively refers to a participant’s age, physical or mental disability, race, color, ethnicity or national origin, sex, gender, pregnancy, sexual orientation, gender identity or expression, religious belief, marital status, genetic information, or military or veteran status.</li>
					  <li>Harassment of a participant based on a participant’s age, physical or mental disability, race, color, ethnicity or national origin, sex, gender, pregnancy, sexual orientation, gender identity or expression, religious belief, marital status, genetic information, or military or veteran status, whether by conduct, language, or other action.</li>
					  <li>Problematic conduct and language may include the nature and manner of communications (including through jokes or imagery), uninvited contact, and unwelcome sexual attention, among others.</li>
					</ul>

                    <h3 class="rhd-700 mt-3">Chat Guidelines for Attendees</h3>
		            <p>For all chat interactions during Red Hat Czech Open House 2021, we expect participants to abide by the event’s Code of Behavior to ensure the environment remains productive and respectful. The following chat guidelines will further help ensure we maintain an inclusive community throughout our two-day event:</p>
           				<ul>
			              <li>Be respectful of others.</li>
			              <li>Avoid conflicts and arguments.</li>
			              <li>Use common sense, kindness, and consideration together with the guidelines outlined above.</li>
			        </ul>

		            <h3 class="rhd-700 mt-5">Enforcement</h3>
        			<p>If a participant engages in behavior that doesn’t comply with these expectations, Red Hat may take any action that we deem appropriate, including warning the participant, excluding the participant from certain activities, prohibiting the participant from attending future Red Hat events, expelling the participant from the virtual experience, banning the participant from online chats and other similar type experiences, and referring the matter to the local authorities. Participants asked to stop any harassing or other unacceptable behavior are expected to comply immediately. If the participant is a Red Hat employee, Red Hat also reserves the right to take full disciplinary action pursuant to our internal policies.</p>

			        <p>Please note, while we take all concerns raised seriously, we will use our discretion to determine when and how to follow up on reported incidents, and may decline to take any further action and/or may direct the participant to other resources to address the concern.</p>

			        <h3 class="rhd-700 mt-5">Reporting an issue</h3>
					<p>If you feel that a participant is not adhering to these expectations, please contact a member of the Red Hat Czech Open House 2021 staff or submit a report with your name, phone number, and contact details and a description of the situation to <a href="mailto:openhouse@redhat.com">openhouse@redhat.com</a> to report a violation of this Code of Behavior.</p>

				    <p>The reporting mechanisms under this Code of Behavior are not intended to address criminal activity or emergency situations. If you have been the victim of a crime or there is an emergency, please contact the appropriate municipal authorities, such as the police, fire, medical, or other emergency responder.</p>

				    <p>Thank you for attending our virtual experience and doing your part to create an environment where all participants can collaborate, learn, and network productively!</p>

				    <p class="text-right"><i>Last Updated: April, 2021</i></p>
				</div>
			</div>
		</div>
    </div>
</section>
@endsection

@include('_layouts.footercz')
