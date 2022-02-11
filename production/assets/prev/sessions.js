$(function () {
    sessions();
});

function sessions() {

    // Global variables -----------------------------------------------------------------------------------------------

    var rooms = {};
    var tracks = {};
    var speakers = [];
    var sessions = [];
    var votes = {};
    var favorites = [];

    var user = null;

    // Init -----------------------------------------------------------------------------------------------------------

    retrieveRooms();

    firebase.auth().onAuthStateChanged(function (currentUser) {
            if (currentUser) {
                user = currentUser;
                retrieveVotes();
                retrieveFavorites();
            } else {
                user = null;
                votes = {};
                favorites = [];
            }
        }, function (error) {
            console.log(error);
        }
    );

    // http://materializecss.com/modals.html#initialization
    $('.modal').modal();

    // http://antenna.io/demo/jquery-bar-rating/examples/
    $('#vote-rating').barrating({
        theme: 'fontawesome-stars',
        showSelectedRating: false
    });

    // -- HTML Triggers -----------------------------------------------------------------------------------------------

    $("body")
    // When click in a session show your details in a modal
        .on("click", ".session", function (event) {
            event.preventDefault();
            var sessionId = $(this).attr("id");
            if (sessionId) {
                openSessionDetails(sessions[sessionId]);
            }
        })
        // When click on filter dropdown, open/close it
        .on('click', ".dropdown-wrapper", function (event) {
            event.stopImmediatePropagation();
            $(this).toggleClass('active');
        })
        // When click in track on filter, add it to the filter
        .on("change", ".track-filter", function (event) {
            event.stopImmediatePropagation();
            filterTracks($(this));
        })
        // When click speaker name on session details, open a modal with speaker details
        .on("click", ".speaker-link", function (event) {
            event.preventDefault();
            var speakerId = $(this).attr("href").split("#")[1];
            openSpeakerDetails(speakerId);
        })
        // When click in favorite on session page or detail
        .on("click", ".session-favorite-icon", function (event) {
            event.preventDefault();
            if (!user) {
                openSignIn();
            } else {
                favorite($("#session-detail").find(".session-id").text());
            }
        })
        // When click in sign in
        .on("click", "#google-sign-in", function (event) {
            event.preventDefault();
            $("#signin").modal('close');
            openGoogleSignInPopup();
        })
        // When click in the save button on feedback/vote popup
        .on("click", "#vote-send", function (event) {
            event.preventDefault();
            saveFeedback();
        })
	.on("click", ".tab", function () {
	   setWidth();
	});
	$(window).on("resize", function() {
	    if($(this).width() < 993){
		setWidth();
	    }
	});


    // -- Helper methods ----------------------------------------------------------------------------------------------

    /**
     * Retrieve all rooms from database
     */
    function retrieveRooms() {
        var roomsRef = firebase.database().ref().child("rooms").orderByChild("name");

        roomsRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var room = childSnapshot.val();
                rooms[room.id] = room;
            });

            createTableHeader();

            retrieveTracks();
        });
    }

    /**
     * Retrieve all tracks from database
     */
    function retrieveTracks() {
        var tracksRef = firebase.database().ref().child("tracks");

        tracksRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var track = childSnapshot.val();
                tracks[formatTrack(track.name)] = track;
            });

            retrieveSpeakers();
        });
    }

    /**
     * Retrieve all speakers from databse
     */
    function retrieveSpeakers() {
        var speakersRef = firebase.database().ref().child("speakers").orderByChild("name");

        speakersRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var speaker = childSnapshot.val();
                speakers[speaker.id] = speaker;
            });

            retrieveSessions();
        });
    }

    /**
     * Retrieve all sesions from database
     */
    function retrieveSessions() {
        var sessionsRef = firebase.database().ref().child("sessions").orderByChild("start");

        sessionsRef.on("child_added", function (snapshot) {
            var session = snapshot.val();
            sessions[session.id] = session;

            addSessionInTable(session);
	    setWidth();
        });

        sessionsRef.on("child_changed", function (snapshot) {
            var session = snapshot.val();
            sessions[session.id] = session;

            $(session.id).remove();
            addSessionInTable(session);
	    setWidth();
            // If popup is opened, change the data there
            var modal = $("#session-detail");
            if (modal.find(".session-id").text() == session.id) {
                setSessionDetailOnModal(session);
            }
        });

        sessionsRef.on("child_removed", function (snapshot) {
            var session = sessions[snapshot.key];
            delete sessions[snapshot.key];

            $(session.id).remove();
        });

        displaySessions();

        if (window.location.hash) {
            var sessionId = window.location.hash.replace("#", "");
            if (sessions[sessionId]) {
                $(window.location.hash)[0].scrollIntoView();
                openSessionDetails(sessions[sessionId]);
            }
        }

    }

    /**
     * Retrieve a list of sessions id what the user have vote
     */
    function retrieveVotes() {
        var favoritesRef = firebase.database().ref().child("votes").child(user.uid);

        favoritesRef.on("child_added", function (snapshot) {
            votes[snapshot.key] = snapshot.val();
            updateFeedbackForm(snapshot.key);
        });

        favoritesRef.on("child_changed", function (snapshot) {
            votes[snapshot.key] = snapshot.val();
            updateFeedbackForm(snapshot.key);
        });

        favoritesRef.on("child_removed", function (snapshot) {
            delete votes[snapshot.key];
            updateFeedbackForm(snapshot.key);
        });
    }

    /**
     * Retrieve a list of sessions id what the user have favorites
     */
    function retrieveFavorites() {
        var favoritesRef = firebase.database().ref().child("favorites").child(user.uid);

        favoritesRef.on("child_added", function (snapshot) {
            var sessionId = snapshot.val();
            favorites.push(sessionId);

            markSessionAsFavorited(sessionId);
        });

        favoritesRef.on("child_removed", function (snapshot) {
            var sessionId = snapshot.val();
            var index = favorites.indexOf(sessionId);
            if (index != -1) {
                favorites.splice(index, 1);
                markSessionAsNotFavorited(sessionId)
            }
        });
    }

    function displaySessions() {
        $("#sessions").removeClass("hide");

        // Force select the first tab
        var sessionsTabs = $("#sessions").find("ul.tabs.tabs-fixed-width");
        var talks = sessionsTabs.find("li.tab:first a").attr('href').substring(1);
        sessionsTabs.tabs('select_tab', talks);

        $(".preloader-wrapper").addClass("hide");
    }

    /**
     * Track name formatter
     *
     * @param trackName
     * @returns {string}
     */
    function formatTrack(trackName) {
        return trackName.toUpperCase().replace(/\s+/g, '-').replace(/,/g, '').replace(/\./g, '').replace(/\//g, '-');
    }

    /**
     *
     * Formatter a timeslot replacing ":" by "_"
     *
     * Example: 10:00 will be change to 10_00
     *
     * @param session
     * @returns {string|XML|void}
     */
    function formatTimeSlot(session) {
        return session.start.replace(/:/g, '_');
    }

    function formatGivenTime(time){
	return time.replace(/:/g, '_');
    }

    /**
     * Create table header based in available rooms
     */
    function createTableHeader() {
        var talks = "<tr><th></th>";
        var contests = "<tr><th></th>";
	var teams = "<tr><th></th>";

        for (var key in rooms) {
            if (roomType(rooms[key]) == "contests") {
                contests += "<th>" + rooms[key].name;
                if(rooms[key].link != undefined && rooms[key].link != ""){
                    contests += "<br><a href='" + rooms[key].link + "' target='_blank'>Join the stream</a>";
                }

                contests += "</th>";
            } else {
		if(roomType(rooms[key]) == "teams"){
           		teams += "<th>" + rooms[key].name;
                if(rooms[key].link != undefined && rooms[key].link != ""){
                    teams += "<br><a href='" + rooms[key].link + "' target='_blank'>Join the stream</a>";
                }
                teams += "</th>";
		} else {
		   talks += "<th>" + rooms[key].name;
           if(rooms[key].link != undefined && rooms[key].link != ""){
                talks += "<br><a href='" + rooms[key].link + "' target='_blank'>Join the stream</a>";
           }
           talks += "</th>";
		}
            }
        }

        $("#talks").find("table.day > thead").append(talks);

        $("#contests").find("table.day > thead").append(contests);

	$("#teams").find("table.day > thead").append(teams);

    }

    /**
     * Adds a session in the corresponding cell
     *
     * @param session Session
     */
    function addSessionInTable(session) {

        if (!existsTimeSlot(session)) {
            createTR(session);
        }

        // New td content
        var html = "<div id='" + session.id + "' class='session hoverable'>" +
            "<div class='session-title'>" + session.title + "</div>" +
            "<div class='hide-on-med-and-down session-detail-bottom'>" +
	    "<div><i class='tiny material-icons table-icon'>person</i>" + getSpeakers(session.speakers,false) + "</div>" +
            "<div><i class='tiny material-icons table-icon'>local_offer</i>" + session.track + "</div>" +
            "<div><i class='tiny material-icons table-icon'>schedule</i>" + session.duration + "</div>" +
            "</div>" +
            "</div>";

        var td = findTd(session);
        // If for some reason this TD (room) does not exists for this day/hour
        if (!td.length) {
            log(session);
        } else {
            td.html(html);
	    td.attr("rowspan", getNoSlots(session));
	    if(td.attr("rowspan") > 1){
		html = "<div sid='" + session.id + "' class='session hoverable hidden absolute' rs='" + td.attr("rowspan") + "'>" +
            "<div class='session-title'>" + session.title + "</div>" +
            "</div>" +
            "</div>";

		td.html(td.html() + html);
	    }


            if (session.track) {

                var divSession = td.find("div.session");
                // Add the track has a class in the session to be filtered
                divSession.addClass(formatTrack(session.track));
                // Check if there is a color for this track in the database
                if (tracks[formatTrack(session.track)]) {
                    divSession.css("background-color", tracks[formatTrack(session.track)].color);
                }

                addTrackToFilterList(session);
            }

        }

    }

    /**
     * 
     * Return count of 40 minutes blocks, which fits to given duration
     *
     * @param session
     * @returns integer
     */
    function getNoSlots(session) {
	var duration = session.duration;
	var result = parseInt(duration.split(":")[0]) * 60;
	result += parseInt(duration.split(":")[1]);

	result = result/20;
	checkTimeSlots(session, result);	
	return result;
    }

    function checkTimeSlots(session, result){
	var time = session.start;
	
	for(i = 0; i < result; i++){
	    if (!existsTimeSlot(session)) {
	        if(i > 0){
			createTR(session,true);
		}else{
			createTR(session);
		}
	    } else {
		if(result > 1 && i > 0){
			removeTD(session);
		}
	    }
	    session.start = nextSlot(session.start);
        }

	session.start = time;
    }

    function removeTD(session){
	$("#" + sessionType(session)).find("table.day > tbody:last-child > tr." + formatTimeSlot(session) + " > td." + session.room).addClass("hidden");
	$("#" + sessionType(session)).find("table.day > tbody:last-child > tr." + formatTimeSlot(session) + " > td." + session.room).attr("hid",session.id);
    }

    function nextSlot(time) {
	var hour = parseInt(time.split(":")[0]),
	    minutes = parseInt(time.split(":")[1]);

        if((minutes+20) >= 60){
		hour += 1;
		minutes = (minutes+20)-60;
	}else{
		minutes += 20;
	}

	if(hour < 10){
		return "0" + hour + ":" + (minutes<10? "0" + minutes: minutes);
	} else {
		return hour + ":" + (minutes<10? "0" + minutes: minutes);
	}
    }

    /**
     *
     * Check if already have a tr to the corresponding day/hour
     *
     * @param session
     * @returns {jQuery}
     */
    function existsTimeSlot(session) {
        return $("#" + sessionType(session)).find("table.day tr." + formatTimeSlot(session)).length;
    }

    /**
     * Create a TR in the table for the day/hour, add the time for this line and pre create the td for the rooms
     *
     * @param session
     */
    function createTR(session, ignoreThisRoom) {
        var html = "<tr class='timeslot " + formatTimeSlot(session) + "'>" +
            "<td class='session-time'>" +
            "<span class='session-hour'>" + session.start.split(":")[0] + "</span>" +
            "<span class='session-minute'>" + session.start.split(":")[1] + "</span>" +
            "</td>";

        // Create a TD per room
        for (key in rooms) {
            if (roomType(rooms[key]) == sessionType(session)) {
		if(ignoreThisRoom){
			if(key != session.room){
				html += "<td class='" + key + "'></td>";
			} else {
				html += "<td class='" + key + " hidden' hid='" + session.id + "'></td>";
			}
		} else {
	            html += "<td class='" + key + "'></td>";
		}
            }
        }
        html += "</tr>";
        $("#" + sessionType(session)).find("table.day > tbody:last-child").append(html);
    }

    function setWidth(){
	$(".absolute").each(function() {
		var longerSessionHover = $("td[hid=" + $(this).attr("sid") + "]");
		var tdWidth = $("#" + $(this).attr("sid")).innerWidth();
		var correction = 10;
		$("td[hid=" + $(this).attr("sid") + "]").each(function (){		
			tdWidth += $(this).outerWidth(true) + 20;
			correction += -1;
		});
		
		$(this).width(tdWidth - correction) ; 
	});
    }

    /**
     * Check if this is a workshop or talk session
     *
     * @param room The room
     * @returns {string} The type of the session "workshops" or "talks"
     */
    function roomType(room) {
        if (room.type.toLowerCase() == "talk"){
            return "talks";
	}

	if (room.type.toLowerCase() == "contest"){
            return "contests"; 
        }

	if (room.type.toLowerCase() == "team"){
            return "teams"; 
        }

	return "talks";
    }

    /**
     * Check if this is a workshop or talk session
     *
     * @param session The session
     * @returns {string} The type of the session "workshops" or "talks"
     */
    function sessionType(session) {
	if (session.type.toLowerCase() == "talk"){
            return "talks"; 
        }

        if (session.type.toLowerCase() == "contest"){
            return "contests";
        }

        if (session.type.toLowerCase() == "team"){
            return "teams";
        }

        return "talks";
    }

    function findTd(session) {
        var type = sessionType(session);
        return $("#" + type)
            .find(
                "table.day" +
                " tr." + formatTimeSlot(session) +
                " td." + session.room
            );
    }

    /**
     * Add the session tracker to a tracker filter list if this is not there yet
     *
     * @param session
     */
    function addTrackToFilterList(session) {
        var type = sessionType(session);
        var trackList = $("#" + type).find(".day-track-filter ul");
        var trackId = formatTrack(session.track);
        if (!(trackList.find("li." + trackId).length)) {
            var trackColor = (tracks[formatTrack(session.track)]) ? tracks[formatTrack(session.track)].color : "#FFFFFF";
            var html = "<li class='day " + trackId + "'>" +
                "<a href='#' style='border-left-color: " + trackColor + "'>" +
                "<input type='checkbox' id='day-" + trackId + "' name='" + trackId + "' " +
                "class='track-filter' value='" + session.track + "'>" +
                "<label for='day-" + trackId + "'>" + session.track + "</label>" +
                "</a></li>";
            trackList.append(html)
        }

        sortUnorderedList(trackList);
    }

    /**
     * Filter session by track
     *
     * @param input Checkbox (track) clicked
     */
    function filterTracks(input) {
        var checkbox = $(input);
        var dayWrapper = $(input).parent().parent().parent().parent().parent();
        var allSessions = dayWrapper.find("div.session");
        var dropdownWrapper = dayWrapper.find(".dropdown-wrapper");
        var checkeds = dropdownWrapper.find(".track-filter:checkbox:checked");
        var filterWrapper = dayWrapper.find(".filter-wrapper");
        var filters = dayWrapper.find(".filters");

        // Hide all to display only filtered
        allSessions.addClass("hide");

        filterWrapper.removeClass("hide");

        var filtersText = "";
        for (i = 0; i < checkeds.length; i++) {
            if (i > 0) {
                filtersText += ", "
            }
            filtersText += $(checkeds[i]).val();
            dayWrapper.find("div.session." + formatTrack($(checkeds[i]).val())).removeClass("hide");
        }
        filters.text(filtersText);

        // if there is no track checked, display all again
        if (checkeds.length == 0) {
            filterWrapper.addClass("hide");
            allSessions.removeClass("hide");
        }
    }

    /**
     * Show session details
     *
     * @param session Session
     */
    function openSessionDetails(session) {

        var modal = $("#session-detail");

        if (tracks[formatTrack(session.track)]) {
            modal.css("background-color", tracks[formatTrack(session.track)].color);
        }

        setSessionDetailOnModal(session);

        modal.modal('open');

    }

    function setSessionDetailOnModal(session) {

        var modal = $("#session-detail");

        var description = (session.description) ? session.description : "";
        var favoriteIcon = (favorites.indexOf(session.id) != -1) ? "favorite" : "favorite_border";

        modal.find(".session-id").text(session.id);

        modal.find(".session-title").text(session.title);
        modal.find(".session-speakers").html(getSpeakers(session.speakers,true));
        modal.find(".session-info .session-track").text(session.track);
        modal.find(".session-info .session-difficulty").text((session.difficulty == "All"?"All audiences":session.difficulty));
        modal.find(".session-info .session-start").text(session.start);
        modal.find(".session-info .session-room").text(rooms[session.room].name);
        modal.find(".session-info .session-duration").text(session.duration);
        modal.find(".session-description").html(description.replace(/\n/g, '<br />'));

        modal.find(".session-favorite-icon").text(favoriteIcon);

        var speakerIcon = $(".session-speakers-icon");
        (session.speakers) ? speakerIcon.removeClass("hide") : speakerIcon.addClass("hide");

        // Vote/Feedback
        var vote = votes[session.id];
        modal.find("#vote-comment").val((vote) ? vote.feedback : "");
        if (vote) {
            modal.find("#vote-rating").barrating('set', vote.rating);
        } else {
            modal.find("#vote-rating").barrating('clear');
        }

        Materialize.updateTextFields();

    }

    function openSpeakerDetails(speakerId) {
        var speaker = speakers[speakerId];
        var modal = $('#speaker-detail');

        modal.find(".speaker-image").attr("src", "/imgs/person-placeholder.jpg");

        // Load image from Firebase Storage
        var avatarRef = firebase.storage().ref().child("speakers/" + speaker.email + ".jpg");
        avatarRef.getDownloadURL().then(function (url) {
            modal.find(".speaker-image").attr("src", url);
        });

        modal.find(".speaker-name").text(speaker.name);
        modal.find(".speaker-country").text(speaker.country);
        modal.find(".speaker-organization").text(speaker.organization);
        modal.find(".speaker-bio").html(speaker.bio.replace(/\n/g, '<br />'));

        var twitterHTML = "";
        if (speaker.twitter) {
            twitterHTML = "<a href='http://twitter.com/" + speaker.twitter + "' target='_blank' class='twitter'>" +
                "@" + speaker.twitter + "" +
                "</a>";

        }
        modal.find(".speaker-twitter").html(twitterHTML);

        modal.modal('open');
    }

    /**
     * Open a popup explaining user need to sign in
     */
    function openSignIn() {
        $("#signin").modal('open');
    }

    /**
     * Open a Google sign in popup
     */
    function openGoogleSignInPopup() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            user = result.user;
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }

    /**
     * Save the vote/feedback about the session/talk
     */
    function saveFeedback() {

        if(!user) {
            openSignIn();
            return;
        }

        var modal = $("#session-detail");
        var sessionId = modal.find(".session-id").text();
        var rating = modal.find("#vote-rating").val();
        var comment = modal.find("#vote-comment").val();

        if (!rating) {
            alert("Rating is required");
            return;
        }

        var data = {};
        data["rating"] = rating;
        data["feedback"] = comment;

        var voteRef = firebase.database().ref().child("votes").child(user.uid).child(sessionId);
        voteRef.set(data, function (error) {
            if (error) {
                alert("An error occurred while processing your request");
            } else {
                modal.modal('close');
            }
        });
    }

    /**
     * If a feedback was added/updated in another device and the feedback (popup) is opened update it in realtime
     *
     * @param sessionId The ID of the session
     */
    function updateFeedbackForm(sessionId) {
        var modal = $("#session-detail");
        var vote = votes[sessionId];

        modal.find("#vote-comment").val((vote) ? vote.feedback : "");
        if (vote) {
            modal.find("#vote-rating").barrating('set', vote.rating);
        } else {
            modal.find("#vote-rating").barrating('clear');
        }

        Materialize.updateTextFields();
    }

    /**
     * Add/remove favorite session
     *
     * @param sessionId The ID of the session
     */
    function favorite(sessionId) {
        var favoritesRef = firebase.database().ref().child("favorites").child(user.uid).child(sessionId);
        if (favorites.indexOf(sessionId) == -1) {
            favoritesRef.set(sessionId);
        } else {
            favoritesRef.remove();
        }
    }

    /**
     * If a session was favorite in another device and the session details (popup) is opened update it in realtime
     *
     * @param sessionId The ID of the session
     */
    function markSessionAsFavorited(sessionId) {
        var modal = $("#session-detail");
        if (modal.find(".session-id").text() == sessionId) {
            modal.find(".session-favorite-icon").text("favorite");
        }
    }

    /**
     * If a session was unfavorite in another device and the session details (popup) is opened update it in realtime
     *
     * @param sessionId The ID of the session
     */
    function markSessionAsNotFavorited(sessionId) {
        var modal = $("#session-detail");
        if (modal.find(".session-id").text() == sessionId) {
            modal.find(".session-favorite-icon").text("favorite_border");
        }
    }

    /**
     * Speaker formatter
     *
     * @param speakersId Speakers id
     * @returns {string} Speakers formatted
     */
    function getSpeakers(speakersId,link) {
        var s = "";

        if (speakersId) {
            for (i = 0; i < speakersId.length; i++) {
                var speaker = speakers[speakersId[i]];
		if(link == true){
	                s += "<a href='/speakers#" + speakers[speakersId[i]].id + "' class='speaker-link'>" + speaker.name + "</a>";
		}else{
			s += speaker.name;
		//	return s;
		}
                if (speakersId.length - 1 > i) {
                    s += ", ";
                }
            }
        }

        return s;
    }

    /**
     * Sort the <ul> list
     *
     * @param theList
     */
    function sortUnorderedList(theList) {
        var listitems = theList.children('li').get();

        listitems.sort(function (a, b) {
            return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
        });

        $.each(listitems, function (idx, itm) {
            theList.append(itm);
        });
    }

    /**
     * Log session on console
     *
     * @param session
     */
    function log(session) {
        console.log(
            "Start: " + session.start + " & " +
            "Room: " + rooms[session.room].name + " & " +
            "Type: " + session.type + " & " +
            "Track: " + session.track + " & " +
            "Title: " + session.title
        );
    }

}
