// Firebase configuration
var config = {
    apiKey: "AIzaSyCljw7yDl7I4_qpJ2I9_3GHXWB1SJZcrOk",
    authDomain: "rps-e7edf.firebaseapp.com",
    databaseURL: "https://rps-e7edf.firebaseio.com",
    projectId: "rps-e7edf",
    storageBucket: "",
    messagingSenderId: "785765240677"
};

var intervalVar;
// This is document.ready event
$(function() {
	
    firebase.initializeApp(config);

    //getting reference to database
	database = firebase.database();

	rootRef = database.ref();
	chatRef = rootRef.child("/chat")
	playerRef = rootRef.child("/players");
	playerOneRef = playerRef.child("/1");
	playerTwoRef = playerRef.child("/2");
	totalPlayerRef = rootRef.child("/totalPlayers");
	turnRef = rootRef.child("/turn");
	curWin = rootRef.child("/currentWin");

	chatArea = $("#chatArea");
	chatArea.val("-Chat messages appear here-");
	//sessionStorage.removeItem("playerName");

	//these events are called whenever player joins game
	playerOneRef.on("value", function(snapshot){
		if(snapshot.val().name!="undefined"){
			$("#playerOneH1").text(snapshot.val().name);
			$("#playerOneH3").text("WINS: " + snapshot.val().wins + " LOSES: " + snapshot.val().loses);
		}
		else{
			$("#playerOneH1").empty();
			$("#playerOneH2").empty();
			$("#playerOneH3").empty();
			$("#playerOneH4").empty();
			$("#playerOneH5").empty();	
		}
	});

	playerTwoRef.on("value", function(snapshot){
		if(snapshot.val().name!="undefined"){
			$("#playerTwoH1").text(snapshot.val().name);
			$("#playerTwoH3").text("WINS: " + snapshot.val().wins + " LOSES: " + snapshot.val().loses);
		}
		else{
			$("#playerTwoH1").empty();
			$("#playerTwoH2").empty();
			$("#playerTwoH3").empty();
			$("#playerTwoH4").empty();
			$("#playerTwoH5").empty();
		}
	});

	//updating database when player refreshes page
	if(sessionStorage.getItem("playerNumber") == "1"){
		$("#game-stat").empty();
		playerOneRef.set({
			choice: "undefined",
			loses: 0,
			wins: 0,
			name: "undefined"
		});

		turnRef.set({
			turn: 0
		});

		curWin.set({
			currentWin: -1
		});


		playerTwoRef.once("value", function(snap){
			if(snap.val().name!="undefined"){
				$("#playerTwoH1").text(snap.val().name);
				$("#playerTwoH3").text("WINS: " + snap.val().wins + " LOSES: " + snap.val().loses);
			}
		});
		
		
		if(sessionStorage.getItem("playerName")!==null){
			sessionStorage.removeItem("playerName");
			var totalplayerscount = totalPlayerRef.child('totalPlayers');

			totalplayerscount.transaction(function(currentplayer) {
   				return currentplayer - 1;
			});
		}
		
	} else if(sessionStorage.getItem("playerNumber") == "2"){
		$("#game-stat").empty();
		playerTwoRef.set({
			choice: "undefined",
			loses: 0,
			wins: 0,
			name: "undefined"
		});

		turnRef.set({
			turn: 0
		});

		curWin.set({
			currentWin: -1
		});

		playerOneRef.once("value", function(snap){
			if(snap.val().name!="undefined"){
				$("#playerOneH1").text(snap.val().name);
				$("#playerOneH3").text("WINS: " + snap.val().wins + " LOSES: " + snap.val().loses);
			}
		});

		if(sessionStorage.getItem("playerName")!==null){
			sessionStorage.removeItem("playerName");
			var totalplayerscount = totalPlayerRef.child('totalPlayers');
			totalplayerscount.transaction(function(currentplayer) {
   				return currentplayer - 1;
			});
		}
	}

	//This event is occured when player starts game by clicking start button
	$("#startButton").on("click", function(){

		totalPlayerRef.once('value', function(snap) {
			let totalPlayersCount = snap.val().totalPlayers;
   			if (totalPlayersCount!=2){
		   		playerName = $("#playerName").val().trim();		
		   		sessionStorage.setItem("playerName",playerName);
		   		if($("#playerOneH1").text()==""){
		   			$("#playerOneH1").text(playerName);
		   			sessionStorage.setItem("playerNumber","1");
		   			playerOneRef.set({
						choice: "undefined",
						loses: 0,
						wins: 0,
						name: playerName
					});
		   		}else{
		   			$("#playerTwoH1").text(playerName);
		   			sessionStorage.setItem("playerNumber","2");
		   			playerTwoRef.set({
						choice: "undefined",
						loses: 0,
						wins: 0,
						name: playerName
					});
		   		}
		   		$("#playerName").val("");
		   		$("#startNewGame").hide();
		   		$("#game-msg-1").html("<h1>Hi " + playerName + "! You are Player " + sessionStorage.getItem("playerNumber"));
		   		$("#sendMessage").attr("disabled",false);
		   		$("#game-msg-2-h1").empty();
		   		totalPlayersCount++;
		   		totalPlayerRef.set({
		   			totalPlayers: totalPlayersCount
		   		});

		   		if (totalPlayersCount==2){
		   			turnRef.update({
		   				turn: 1
		   			});
		   		}

			}else{
				$("#game-msg-2-h1").text("Sorry ! Game is already being played by 2 players. Please try later!!");
		}	

		});
	});

	turnRef.on("value" , function(snap){
		if(snap.val().turn==1){
			if(sessionStorage.getItem("playerNumber")==1){
		   		$("#game-msg-2-h1").text("It's your turn");
		   		$("#playerOneH2").text("Rock");
		   		$("#playerOneH2").addClass("choices");
		   		$("#playerOneH4").text("Paper");
		   		$("#playerOneH4").addClass("choices");
		   		$("#playerOneH5").text("Scissors");
		   		$("#playerOneH5").addClass("choices");
		   		$("#player-1").css("border", "2px solid yellow");
		   		$("#player-2").css("border", "2px solid green");
		   		$("#game-stat").empty();
		   		$("#playerTwoH2").text("");
		   		$("#playerTwoH4").text("");
		   		$("#playerTwoH5").text("");
		   	}else{
		   		$("#game-msg-2-h1").text("Waiting for " + $("#playerOneH1").text() + " to choose.");
		   		$("#player-1").css("border", "2px solid yellow");
		   		$("#game-stat").empty();
		   		$("#playerTwoH2").text("");
		   		$("#playerTwoH4").text("");
		   		$("#playerTwoH5").text("");
		   		$("#playerOneH2").text("");
		   		$("#playerOneH4").text("");
		   		$("#playerOneH5").text("");
		   	}
		}
		else if(snap.val().turn==2){
			if(sessionStorage.getItem("playerNumber")==2){
		   		$("#game-msg-2-h1").text("It's your turn");
		   		$("#playerTwoH2").text("Rock");
		   		$("#playerTwoH2").addClass("choices");
		   		$("#playerTwoH4").text("Paper");
		   		$("#playerTwoH4").addClass("choices");
		   		$("#playerTwoH5").text("Scissors");
		   		$("#playerTwoH5").addClass("choices");
		   		$("#player-2").css("border", "2px solid yellow");
		   		$("#player-1").css("border", "2px solid green");
		   	}else{
		   		$("#game-msg-2-h1").text("Waiting for " + $("#playerTwoH1").text() + " to choose.");
		   		$("#player-2").css("border", "2px solid yellow");
		   	}	
		}
	});

	$(document).on("click",".choices",function(){
		if(sessionStorage.getItem("playerNumber")==1){
			$("#playerOneH2").removeClass("choices");
			$("#playerOneH4").removeClass("choices");
			$("#playerOneH5").removeClass("choices");
			$("#player-1").css("border", "2px solid green");
			if ($(this).text()=="Rock"){
				$("#playerOneH4").text("Rock");
			} else if($(this).text()=="Paper"){
				$("#playerOneH4").text("Paper");
			} else if($(this).text()=="Scissors"){
				$("#playerOneH4").text("Scissors");
			}
			
			playerOneRef.update({
				choice: $(this).text()
			});

			$("#playerOneH2").text(".");
			$("#playerOneH5").text(".");
			
			turnRef.update({
				turn: 2
			});

		} else if(sessionStorage.getItem("playerNumber")==2){
			var playerOneChoice;
			var playerTwoChoice;
			var playerWin;

			$("#playerTwoH2").removeClass("choices");
			$("#playerTwoH4").removeClass("choices");
			$("#playerTwoH5").removeClass("choices");
			$("#player-2").css("border", "2px solid green");
			if ($(this).text()=="Rock"){
				$("#playerTwoH4").text("Rock");
			} else if($(this).text()=="Paper"){
				$("#playerTwoH4").text("Paper");
			} else if($(this).text()=="Scissors"){
				$("#playerTwoH4").text("Scissors");
			}

			playerTwoChoice = $(this).text();

			$("#playerTwoH2").text(".");
			$("#playerTwoH5").text(".");

			playerTwoRef.update({
				choice: playerTwoChoice
			});

			playerOneRef.once("value" , function(snap){
				playerOneChoice = snap.val().choice;
			});

			if (playerOneChoice=="Rock" && playerTwoChoice=="Paper") {
				playerWin = 2;
			} else if (playerOneChoice=="Scissors" && playerTwoChoice=="Paper"){
				playerWin = 1;
			} else if (playerOneChoice=="Paper" && playerTwoChoice=="Rock"){
				playerWin = 1;
			} else if (playerOneChoice=="Paper" && playerTwoChoice=="Scissors"){
				playerWin = 2;
			} else if (playerOneChoice=="Rock" && playerTwoChoice=="Scissors") {
				playerWin = 1;
			} else if (playerOneChoice=="Scissors" && playerTwoChoice=="Rock"){
				playerWin = 2;
			} else {
				playerWin = 0;
			}

			if(playerWin==1){
				
				var totalwins = playerOneRef.child('wins');
				totalwins.transaction(function(wins) {
   					return wins + 1;
				});

				var totalloses = playerTwoRef.child('loses');
				totalloses.transaction(function(loses) {
   					return loses + 1;
				});

				curWin.set({
					currentWin : 1
				});			

			} else if(playerWin==2){
				var totalwins = playerTwoRef.child('wins');
				totalwins.transaction(function(wins) {
   					return wins + 1;
				});

				var totalloses = playerOneRef.child('loses');
				totalloses.transaction(function(loses) {
   					return loses + 1;
				});

				curWin.set({
					currentWin : 2
				});

			} else if(playerWin==0){
				curWin.set({
					currentWin : 0
				});
			}
					
		}
	});

	curWin.on("value",function(snap){
		if (snap.val().currentWin==1){
			var playerOneName = $("#playerOneH1").text();
			$("#game-stat").text(playerOneName + " Wins.");
			$("#game-msg-2-h1").empty();
			playerOneRef.once("value", function(snap){
				$("#playerOneH4").text(snap.val().choice);
				$("#playerOneH2").text(".");
				$("#playerOneH5").text(".");
			});
			playerTwoRef.once("value", function(snap){
				$("#playerTwoH4").text(snap.val().choice);
				$("#playerTwoH2").text(".");
				$("#playerTwoH5").text(".");
			});
			intervalVar = setTimeout(startNewGame, 4000);
		}

		if (snap.val().currentWin==2){
			var playerTwoName = $("#playerTwoH1").text();
			$("#game-stat").text(playerTwoName + " Wins.");
			$("#game-msg-2-h1").empty();
			playerOneRef.once("value", function(snap){
				$("#playerOneH4").text(snap.val().choice);
				$("#playerOneH2").text(".");
				$("#playerOneH5").text(".");
			});
			playerTwoRef.once("value", function(snap){
				$("#playerTwoH4").text(snap.val().choice);
				$("#playerTwoH2").text(".");
				$("#playerTwoH5").text(".");
			});
			intervalVar = setTimeout(startNewGame, 4000);
		}

		if (snap.val().currentWin==0){
			$("#game-stat").text("Game Tied.");
			$("#game-msg-2-h1").empty();
			playerOneRef.once("value", function(snap){
				$("#playerOneH4").text(snap.val().choice);
				$("#playerOneH2").text(".");
				$("#playerOneH5").text(".");
			});
			playerTwoRef.once("value", function(snap){
				$("#playerTwoH4").text(snap.val().choice);
				$("#playerTwoH2").text(".");
				$("#playerTwoH5").text(".");
			});
			intervalVar = setTimeout(startNewGame, 4000);
		}
	});

	// This function is called to start new game
	function startNewGame(){
		clearTimeout(intervalVar);
		curWin.set({
			currentWin: -1
		});

		playerOneRef.update({
			choice: "undefined"
		});

		playerTwoRef.update({
			choice: "undefined"
		});		

		turnRef.set({
			turn: 1
		});
	}

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