$(function () {
    initializeFirebase();

    // http://materializecss.com/modals.html#initialization
    $('.modal').modal();
});

function initializeFirebase() {
    var config = {
        apiKey: "AIzaSyDgqcjzwPTV4zXIVntnRPcWPeFS1DarmtM",
	authDomain: "openhouse-2017.firebaseapp.com",
	databaseURL: "https://openhouse-2017.firebaseio.com",
	storageBucket: "openhouse-2017.appspot.com",
    	messagingSenderId: "171082168711"
    };

    firebase.initializeApp(config);
}
