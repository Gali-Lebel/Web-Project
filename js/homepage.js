$(document).ready(function () {

  //Connection to firebase.
  var firebaseConfig = {
    apiKey: "AIzaSyAihzLJnEDWY_NjHUReUkCApr2LvVYAMZA",
    authDomain: "toy-store-f89d0.firebaseapp.com",
    projectId: "toy-store-f89d0",
    storageBucket: "toy-store-f89d0.appspot.com",
    messagingSenderId: "613059830597",
    appId: "1:613059830597:web:5f59a79242eaf3a1b4942c",
    measurementId: "G-L02JBR88W2"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  //If there is a logged in user move it to the rest of the pages who knew who it was.
  var myData = localStorage['objectToPass'];
  if (myData) {
    localStorage.setItem('objectToPass', myData);
  }

  //Receive the updated array from another page.
  var items = JSON.parse(sessionStorage.getItem("items"));

  //Checks if there is a user logged in and if so checks who he is.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      var change = document.getElementById("login");
      change.value = "Log Out";
      var docRef = db.collection("users").doc(user.email);
      docRef.get().then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          var hello = document.getElementById("user_hello");
          hello.innerText = "Hi " + data.name
        } else {
          console.log("No such document!");
        }
      })
    }
  });

  //Using the Login and Logout button respectively.
  var change = document.getElementById("login");
  change.addEventListener("click", () => {
    if (change.value == "Log In") {
      change.value = "Log Out";
      location.href = "login.html";
    } else {
      firebase.auth().signOut().then(function () {
        for (i = 0; i < 10; i++) {
          items[i]["amount"] = 0;
        }
        sessionStorage.setItem("items", JSON.stringify(items));
        $('#table tbody').remove();
        $("#count").html(0);
        change.value = "Log In";
        setTimeout(function () {
          location.href = "homepage.html";
        }, 100);
      })
      change.value = "Log In";
    }
  })

});






