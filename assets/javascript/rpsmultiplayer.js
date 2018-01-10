// Firebase configuration
var config = {
    apiKey: "AIzaSyCljw7yDl7I4_qpJ2I9_3GHXWB1SJZcrOk",
    authDomain: "rps-e7edf.firebaseapp.com",
    databaseURL: "https://rps-e7edf.firebaseio.com",
    projectId: "rps-e7edf",
    storageBucket: "",
    messagingSenderId: "785765240677"
};

// This is document.ready event
$(function() {
    firebase.initializeApp(config);

    //getting reference to database
	database = firebase.database();
	playerRef = database.ref("/Player");
	rootRef = database.ref();
	chatRef = rootRef.child("/chat")

	chatArea = $("#chatArea");
	chatArea.val("-----Chat Messages appear here-----");

	//This event is occured when player starts game by clicking start button
	$("#startButton").on("click", function(){
		 playerName = $("#playerName").val().trim();		
		 sessionStorage.setItem("playerName",playerName);
	});

	// This event is occured when player send chat message
	$("#sendMessage").on("click", function(e){
		 var textMsg = $("#textMessage");
		 e.preventDefault();
		 chatRef.set({
		 	chatmsg: sessionStorage.getItem("playerName") + " : " + textMsg.val().trim()
		 });
		 textMsg.val("");
	});	

	//This event is occured after players send chat messages
	chatRef.on("value", function(snapshot) {
		var newLine = "\r\n";
		var chatMsg = snapshot.val().chatmsg;
		var chatText = chatArea.val();
		chatArea.val(chatText + newLine + chatMsg);
		chatRef.set({
		 	chatmsg: " "
		 });
	});
});