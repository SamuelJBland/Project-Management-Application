var popUp = document.getElementById('loginPopUp');

//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var button = document.getElementsByIDName("popUpCloseButton")[0];

button.onclick = function() {
    popUp.style.display = "none";
}
