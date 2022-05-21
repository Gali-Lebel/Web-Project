//Receive the updated array from another page.
var items = JSON.parse(sessionStorage.getItem("items"));

//Function for calculating the current payment.
function calc() {
    var count = 0;
    for (i = 0; i < items.length; i++) {
        var vals = items[i];
        var number = vals["price"];
        if (number != null) {
            var numb = number.replace(/[^0-9]/g, '');
            count += numb * vals["amount"];
        }
    }
    return count.toFixed(2);
}

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
    var myData = localStorage['objectToPass'];

    //Checks if there is a user logged in and if so checks who he is.
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var change = document.getElementById("login");
            change.value = "Log Out";
            var docRef = db.collection("users").doc(user.email);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    var emailText = document.getElementById("email");
                    emailText.value = user.email;
                    var nameText = document.getElementById("name");
                    nameText.value = data.name;
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
            }).catch(function (error) {
            });
        }
    });

    //Calculation of the current payment amount.
    $("#count").html(calc());

    //Sending the updated array to the products page.
    $("#passArrayToProducts").on("click", function () {
        sessionStorage.setItem("items", JSON.stringify(items));
    });

    //Sending the updated array to the home page.
    $("#passArrayToHome").on("click", function () {
        sessionStorage.setItem("items", JSON.stringify(items));
    });

    //After clicking the submit button, save the order in firebase to the same user who is currently logged in.
    $('#complit').on('click', function () {
        $("#error-message-phone").html('')
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                flag = 0;
                for (i = 0; i < 10; i++) {
                    if(items[i]["amount"] != 0){
                        flag = 1;
                        break;
                    } 
                }
                if(flag == 0){
                    $("#error-message-phone").html("this order is empty.")
                    return;
                }
                if (checkAllFilds()) {
                    prod = [];
                    for (i = 0; i < 10; i++) {
                        if (items[i]["amount"] != 0) {
                            prod.push(items[i]);
                        }
                    }
                    db.collection("orders").add({
                        orders: prod,
                    }).then(function (docRef) {
                        db.collection("users").doc(myData).update({
                            orders: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                        })
                    }).catch(function (error) {
                        console.error("Error adding document: ", error);
                    });

                    for (i = 0; i < 10; i++) {
                        items[i]["amount"] = 0;
                    }
                    sessionStorage.setItem("items", JSON.stringify(items));
                    setTimeout(function () {
                        location.href = "homepage.html";
                    }, 1000);
                    $("#name, #email,#address,#phone").val('')
                }
            }
            else {
                location.href = "login.html";
            }
        });
    });

    //Download in 1 the quantity of that specific product clicked in the table.
    $('table').on('click', '.decClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempAmount = cells[6].innerText;
        var tempName = cells[2].innerText;
        var element = items.find(element => element.item_name == tempName);
        tempAmount--;
        element.amount = tempAmount;
        if (tempAmount == 0) {
            $(this).closest("tr").remove();
        }
        cells[6].innerText--;
        $("#count").html(calc());
    });

    //Deletion of that specific product clicked on the table.
    $('table').on('click', '.delClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempName = cells[2].innerText;
        var element = items.find(element => element.item_name == tempName);
        element.amount = 0;
        $(this).closest("tr").remove();
        $("#count").html(calc());
    });

    //Add in 1 the quantity of that specific product clicked in the table.
    $('table').on('click', '.incClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempAmount = cells[6].innerText;
        var tempName = cells[2].innerText;
        var element = items.find(element => element.item_name == tempName);
        tempAmount++;
        element.amount = tempAmount;
        cells[6].innerText++;
        $("#count").html(calc());
    });

});

//Check that the email they entered is correct.
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


//Check that the phone number they entered is correct.
function phonenumber(inputtxt) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(String(inputtxt).toLowerCase());
}


//Check that the fields of the order form are correct.
function checkAllFilds() {
    $("#error-message-name").html('')
    $("#error-message-email").html('')
    $("#error-message-address").html('')
    $("#error-message-phone").html('')
    var check = true;
    if ($("#name").val() == "") {
        $("#error-message-name").html("please fill name")
        check = false;
    }
    if ($("#email").val() == '' || !validateEmail($("#email").val())) {
        $("#error-message-email").html("please fill a valid email")
        check = false;
    }
    if ($("#address").val() == '') {
        $("#error-message-address").html("please fill a valid address")
        check = false;
    }
    if ($("#phone").val() == '' || !phonenumber($('#phone').val())) {
        $("#error-message-phone").html("please fill a valid phone number")
        check = false;
    }
    return check;
}