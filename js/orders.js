//Receive the updated array from another page.
var items = JSON.parse(sessionStorage.getItem("items"));

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

    //A function that displays all orders with editing and deletion options if the logged in user is the webmaster.
    function adminOrders() {
        let str = "";
        db.collection("orders").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                str += '<tr><td>' + doc.id + '</td><td>';
                var data = doc.data();
                var len = data.orders.length;
                for (i = 0; i < len; i++) {
                    str += data.orders[i]["item_id"] + '&emsp;' + data.orders[i]["item_name"] + '&emsp;' + data.orders[i]["amount"] + '<br>';
                }
                str += '</td>';
                str += '<td><input type=button class=delOrder></input></td>';
                str += '<td><input type=button class=updateOrder id=updateOrder></input></td></tr>';
            });
            $('#table tr:last').after(str);
        });
    }

    //Go to the edit page of the specific order you clicked on in the table.
    $('table').on('click', '.updateOrder', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempName = cells[0].innerText;
        console.log(tempName);
        sessionStorage.setItem("orderNum", JSON.stringify(tempName));
        location.href = "updateOrder.html";

    });

    //Delete the specific order that was clicked on in the table, and update the user to whom the order belongs.
    $('table').on('click', '.delOrder', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempName = cells[0].innerText;
        console.log(tempName);
        $(this).closest("tr").remove();
        db.collection("orders").doc(tempName).delete()
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                var len = data.orders.length;
                var orders = data.orders;
                console.log("data " + data.orders);
                for (i = 0; i < len; i++) {
                    if (orders[i] == tempName) {
                        console.log("delete?  " + orders[i]);
                        db.collection("users").doc(doc.id).update({
                            orders: firebase.firestore.FieldValue.arrayRemove(tempName)
                        })
                    }
                }
            });
        });
    });

    //Using the Login and Logout button respectively.
    var change = document.getElementById("login");
    console.log(change);
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
                change.value = "Log In";
                setTimeout(function () {
                    location.href = "homepage.html";
                }, 100);
            }).catch(function (error) {

            });
        }
    });

    //Checks if there is a user logged in and if so checks who he is,
    //Also checks if he is a regular user or webmaster and builds the order table accordingly.
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var change = document.getElementById("login");
            change.value = "Log Out";
            var docRef = db.collection("users").doc(user.email);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    var hello = document.getElementById("user_hello");
                    hello.innerText = "Hi " + data.name
                    if (data.permission == "admin") {
                        adminOrders();
                    } else {
                        var itemsOrder = data.orders;
                        itemsOrder.forEach(element => {
                            var elementRef = db.collection("orders").doc(element);
                            elementRef.get().then((doc) => {
                                let str = "";
                                if (doc.exists) {
                                    var dataOrders = doc.data();
                                    str += '<tr><td>' + doc.id + '</td><td> ';
                                    dataOrders.orders.forEach(element => {
                                        str += element["item_id"] + '&emsp;' + element["item_name"] + '&emsp;' + element["amount"] + '<br>';
                                    });
                                    str += '</td></tr>';
                                }
                                $('#table tr:last').after(str);
                            });
                        });
                    }
                } else {
                    location.href = "homepage.html";
                }
            })
        }
        else {
            location.href = "login.html";
        }
    });
});

