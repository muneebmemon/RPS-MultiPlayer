var config = {
    apiKey: "AIzaSyCljw7yDl7I4_qpJ2I9_3GHXWB1SJZcrOk",
    authDomain: "rps-e7edf.firebaseapp.com",
    databaseURL: "https://rps-e7edf.firebaseio.com",
    projectId: "rps-e7edf",
    storageBucket: "",
    messagingSenderId: "785765240677"
};

$(function() {
    firebase.initializeApp(config);
	database = firebase.database();
	playerRef = database.ref("/Player");
	rootRef = database.ref();
	startGameRef = database.ref("/startGame");

	$("#startButton").on("click", function(){
		startGameRef.set({
			startGame: "true"
		});
	});

});