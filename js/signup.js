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
    
    //Clicking the button checks if the email already exists,
    //if not checks that the fields are filled in correctly and saves the user in firebase.
    $('#signup').on('click', function () {
        if (checkAllFilds()) {
            var b = emailExist($("#email").val());
            setTimeout(function () {
                b.then(function (result) {
                    if (result) {
                        $("#error-message-email").html("This email alredy exist")
                    }
                    else {
                        let email = document.getElementById("email").value
                        localStorage.setItem('objectToPass', email);
                        let fullName = document.getElementById("fullnameup").value
                        let password = document.getElementById("passup").value
                        firebase.auth().createUserWithEmailAndPassword(email, password)
                            .catch((error) => {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log(errorMessage);
                                console.log(errorCode);
                            });
                        if (email.length > 0 && fullName.length > 0 && password.length > 0) {
                            db.collection("users").doc(email).set({
                                name: fullName,
                                orders: [],
                                permission: "user"
                            })
                        }
                        setTimeout(function () {
                            location.href = "homepage.html";
                        }, 1000);
                        $("#fullnameup, #email,#passup,#pass2").val('')
                    }
                });
            }, 1000);
        }
    });

    //Checks if this email is already registered in the system.
    async function emailExist(email) {
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            return true;
        }
        else {
            return false;
        }
    }

    //Check that the email they entered is correct.
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //Check that the fields of the order form are correct.
    function checkAllFilds() {
        $("#error-message-name").html('')
        $("#error-message-email").html('')
        $("#error-message-pass1").html('')
        $("#error-message-pass2").html('')
        var check = true;
        if ($("#fullnameup").val() == "") {
            $("#error-message-name").html("please fill name")
            check = false;
        }
        if ($("#email").val() == '' || !validateEmail($("#email").val())) {
            $("#error-message-email").html("please fill a valid email")
            check = false;
        }
        if ($("#passup").val() == '') {
            $("#error-message-pass1").html("please fill a valid password")
            check = false;
        }
        if ($("#pass2").val() == '') {
            $("#error-message-pass2").html("please fill a valid password")
            check = false;
        }
        if ($("#passup").val() != $("#pass2").val()) {
            $("#error-message-pass2").html("passwords do not match..")
            check = false;
        }

        return check;
    }
});



