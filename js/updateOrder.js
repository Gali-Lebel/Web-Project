//Gets the order number you want to edit.
var items = JSON.parse(sessionStorage.getItem("orderNum"));

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

    //Checks if there is a user logged in and if so checks who he is.
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

                } else {
                    location.href = "homepage.html";
                }
            })
        }
        else {
            location.href = "login.html";
        }
    });

    //Build the table in a loop according to the amount of items available in the order.
    var table = document.getElementById('table');
    var tbody = document.createElement('tbody');
    var elementRef = db.collection("orders").doc(items);
    elementRef.get().then((doc) => {
        let str = "";
        if (doc.exists) {
            var data = doc.data();
            var dataOrders = data.orders;
            console.log(dataOrders.length);
            var len = data.orders.length;
            var cell;
            for (i = 0; i < len; i++) {
                var row = document.createElement('tr'); //Create row in table for each item in the order
                cell = document.createElement('td');
                var img = document.createElement('img');
                img.src = dataOrders[i]['item_image'];
                cell.appendChild(img);
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['item_id'];
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['item_name'];
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['item_category'];
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['item_variant'];
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['price'];
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = dataOrders[i]['amount'];
                row.appendChild(cell);

                cell = document.createElement('td'); //create 3 buttons per row in the tabl
                var deleteB = document.createElement('input');
                var decB = document.createElement('input');
                var incB = document.createElement('input');
                deleteB.setAttribute('type', "button");
                deleteB.setAttribute('class', "delClass");
                decB.setAttribute('type', "button");
                decB.setAttribute('class', "decClass");
                incB.setAttribute('type', "button");
                incB.setAttribute('class', "incClass");

                cell.appendChild(decB);
                cell.appendChild(incB);
                cell.appendChild(deleteB);
                row.appendChild(cell);
                tbody.appendChild(row);
            }
            table.appendChild(tbody);
        }

    });

    //Lower by 1 the quantity of the specific product that was clicked on in the table,
    //if its quantity before the download was 1 then delete it,
    //if it was the only item in the order then delete the order and update with the user to whom the order belongs.
    $('table').on('click', '.decClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempAmount = cells[6].innerText;
        var tempName = cells[2].innerText;
        tempAmount--;
        db.collection("orders").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                var len = data.orders.length;
                var orders = data.orders;
                for (i = 0; i < len; i++) {
                    if (orders[i]['item_name'] == tempName) {
                        db.collection("orders").doc(items).update({
                            orders: firebase.firestore.FieldValue.arrayRemove(orders[i])
                        });
                        if (tempAmount == 0) {
                            $(this).closest("tr").remove();
                            len--;
                            if (len == 0) {
                                db.collection("users").get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        var data = doc.data();
                                        var len = data.orders.length;
                                        var orders = data.orders;
                                        for (i = 0; i < len; i++) {
                                            if (orders[i] == items) {
                                                db.collection("users").doc(doc.id).update({
                                                    orders: firebase.firestore.FieldValue.arrayRemove(items)
                                                })
                                            }
                                        }
                                    });
                                });
                                db.collection("orders").doc(items).delete()
                            }
                        }
                        else {
                            var dataOrders = orders[i];
                            dataOrders.amount = tempAmount;
                            db.collection("orders").doc(items).update({
                                orders: firebase.firestore.FieldValue.arrayUnion(dataOrders)
                            });
                        }
                    }
                }
            });
        });
        cells[6].innerText--;
    });

    //Delete the specific product from the order, and if it was the last product in the order,
    //stand by the user to whom the order to which it was deleted belongs.
    $('table').on('click', '.delClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempName = cells[2].innerText;
        $(this).closest("tr").remove();
        db.collection("orders").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                var len = data.orders.length;
                var orders = data.orders;
                for (i = 0; i < len; i++) {
                    if (orders[i]['item_name'] == tempName) {
                        db.collection("orders").doc(items).update({
                            orders: firebase.firestore.FieldValue.arrayRemove(orders[i])
                        });
                        len--;
                        if (len == 0) {
                            db.collection("users").get().then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    var data = doc.data();
                                    var len = data.orders.length;
                                    var orders = data.orders;
                                    for (i = 0; i < len; i++) {
                                        if (orders[i] == items) {
                                            db.collection("users").doc(doc.id).update({
                                                orders: firebase.firestore.FieldValue.arrayRemove(items)
                                            })
                                        }
                                    }
                                });
                            });
                            db.collection("orders").doc(items).delete()
                        }
                    }
                }
            });
        });
    });

    //Increase by 1 the quantity of the specific product that was clicked on in the table, and update in firebase.
    $('table').on('click', '.incClass', function () {
        var row = $(this).closest('tr')
        var cells = row.find('td');
        var tempAmount = cells[6].innerText;
        var tempName = cells[2].innerText;
        tempAmount++;
        db.collection("orders").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                var len = data.orders.length;
                var orders = data.orders;
                for (i = 0; i < len; i++) {
                    if (orders[i]['item_name'] == tempName) {
                        db.collection("orders").doc(items).update({
                            orders: firebase.firestore.FieldValue.arrayRemove(orders[i])
                        });
                        var dataOrders = orders[i];
                        dataOrders.amount = tempAmount;
                        db.collection("orders").doc(items).update({
                            orders: firebase.firestore.FieldValue.arrayUnion(dataOrders)
                        });
                    }
                }
            });
        });
        cells[6].innerText++;
    });
});

