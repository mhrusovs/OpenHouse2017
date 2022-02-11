$(function () {
    speakers();
});

function speakers() {

    // Speakers local cache
    var speakers = [];

    // -- Firebase Database Triggers ----------------------------------------------------------------------------------

    var speakersRef = firebase.database().ref().child("speakers").orderByChild("name");

    speakersRef.once('value', function (snapshot) {
        speakersRef.on("child_added", function (snapshot) {
            var speaker = snapshot.val();
            speakers[speaker.id] = speaker;

            addNewSpeakerCard(speaker)
        });

        speakersRef.on("child_changed", function (snapshot) {
            var speaker = snapshot.val();
            speakers[speaker.id] = speaker;

            updateSpeakerCardInfo(speaker);

            // If popup is opened, change the data there
            var modal = $("#speaker-detail");
            if (modal.find(".speaker-id").text() == speaker.id) {
                setSpeakerDetailOnModal(speaker);
            }
        });

        speakersRef.on("child_removed", function (snapshot) {
            var speaker = snapshot.val();
            delete speakers[snapshot.key];

            $(speaker.id).remove();
        });

        displaySpeakers();

        if (window.location.hash) {
            var speakerId = window.location.hash.replace("#", "");
            if (speakers[speakerId]) {
                $(window.location.hash)[0].scrollIntoView();
                showSpeakerDetails(speakerId);
            }
        }

    });

    // -- HTML Triggers -----------------------------------------------------------------------------------------------

    $("body")
    // Display speakers details
        .on("click", ".card-image.speaker-image", function (event) {
            event.stopImmediatePropagation();

            showSpeakerDetails($(this).parent().attr("id"));
        })
        // Hide speaker bio when click on speaker bio
        .on("click", ".card-content.speaker-bio", function (event) {
            event.stopImmediatePropagation();

            $(this).slideToggle();
        });

    // -- Helper methods ----------------------------------------------------------------------------------------------

    function displaySpeakers() {
        $(".preloader-wrapper").addClass("hide");
    }

    /**
     * Add a new material design card with the speaker
     *
     * @param speaker speaker instance
     */
    function addNewSpeakerCard(speaker) {

        var html = "<div id='" + speaker.id + "' class='card speaker hoverable'>" +
            "<div class='card-image speaker-image'>" +
            "<span class='card-title speaker-name'>" + speaker.name + "</span>" +
            "</div>";

        $('.speakers-container').append(html);

        // Load image from Firebase Storage
        var avatarRef = firebase.storage().ref().child("speakers/" + speaker.email  + ".jpg");
        avatarRef.getDownloadURL().then(function (url) {
            $("#" + speaker.id).find(".speaker-image").css('background-image', 'url(' + url + ')');
            $("#" + speaker.id).find(".speaker-image").css('background-position', speaker.align);
        });
    }

    function updateSpeakerCardInfo(speaker) {
        var speakerCard = $("div#" + speaker.id);
        speakerCard.find(".speaker-name").text(speaker.name);
    }

    function showSpeakerDetails(speakerId) {
        var speaker = speakers[speakerId];
        var modal = $('#speaker-detail');

        loadSpeakerAvatarOnModal(speaker);
        setSpeakerDetailOnModal(speaker);

        modal.modal('open');
    }

    function loadSpeakerAvatarOnModal(speaker) {
        var modal = $('#speaker-detail');

        modal.find(".speaker-image").attr("src", "/imgs/person-placeholder.jpg");

        // Load image from Firebase Storage
        var avatarRef = firebase.storage().ref().child("speakers/" + speaker.email + ".jpg");
        avatarRef.getDownloadURL().then(function (url) {
            modal.find(".speaker-image").attr("src", url);
        });
    }

    function setSpeakerDetailOnModal(speaker) {
        var modal = $('#speaker-detail');

        modal.find(".speaker-id").text(speaker.id);
        modal.find(".speaker-name").text(speaker.name);
        modal.find(".speaker-bio").html(speaker.bio.replace(/\n/g, '<br>'));
    }

}
