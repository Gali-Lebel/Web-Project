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

    //At the click of a button, it checks that the email exists in the extension and that this is its correct password.
    $('#login').on('click', function () {
        let email = document.getElementById("email").value
        let pass = document.getElementById("pass").value

        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                setTimeout(function () {
                    location.href = "homepage.html";
                }, 500);
            })
            .catch((error) => {
                $("#error-message-pass").html("The password is incorrect")
            });

        if (email.length > 0 && pass.length > 0) {
            var docRef = db.collection("users").doc(email);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    localStorage.setItem('objectToPass', email);
                } else {
                    console.log("No such document!");
                    $("#error-message-email").html("The email does not exist in the system")

                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            $("#error-message-email").html('')
            $("#error-message-pass").html('')
        }
    });
});