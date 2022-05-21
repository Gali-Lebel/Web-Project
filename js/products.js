//Static list of products.
let puzzel_nature = {
  item_image: '../images/puzzel_N.jpg',
  item_id: 'SKU_123',
  item_name: 'Nature-puzzle',
  item_category: 'puzzels',
  item_variant: '1000 parts',
  price: 312 + '$',
  amount: 0
};

let puzzel_animal = {
  item_image: '../images/puzzel_A.jpg',
  item_id: 'SKU_258',
  item_name: 'Animal-puzzle',
  item_category: 'puzzels',
  item_variant: '600 parts',
  price: 215 + '$',
  amount: 0
};

let monopoly = {
  item_image: '../images/monapoly.jpg',
  item_id: 'SKU_945',
  item_name: 'Monopoly',
  item_category: 'box games',
  item_variant: 'Age 8 plus',
  price: 290 + '$',
  amount: 0
};

let rummikub = {
  item_image: '../images/rummikub.jpg',
  item_id: 'SKU_675',
  item_name: 'Rummikub',
  item_category: 'box games',
  item_variant: 'Age 6 plus',
  price: 365 + '$',
  amount: 0
};

let ring_toss = {
  item_image: '../images/ringtoss.jpg',
  item_id: 'SKU_324',
  item_name: 'Ring-toss',
  item_category: 'ourdoor games',
  item_variant: 'Any Age',
  price: 136 + '$',
  amount: 0
};

let bowling = {
  item_image: '../images/bowling.jpeg',
  item_id: 'SKU_435',
  item_name: 'Bowling',
  item_category: 'ourdoor games',
  item_variant: 'Any Age',
  price: 198 + '$',
  amount: 0
};

let kite = {
  item_image: '../images/kite.jpg',
  item_id: 'SKU_815',
  item_name: 'Kite',
  item_category: 'ourdoor games',
  item_variant: 'Any Age',
  price: 95 + '$',
  amount: 0
};

let water_gun = {
  item_image: '../images/watergun.jpg',
  item_id: 'SKU_475',
  item_name: 'Water-Gun',
  item_category: 'water games',
  item_variant: 'Age 4 plus',
  price: 140 + '$',
  amount: 0
};

let sea_tools = {
  item_image: '../images/seatools.jpg',
  item_id: 'SKU_249',
  item_name: 'Sea-Tools',
  item_category: 'water games',
  item_variant: 'Age 2 plus',
  price: 75 + '$',
  amount: 0
};

let sea_mattress = {
  item_image: '../images/seamattress.jpg',
  item_id: 'SKU_194',
  item_name: 'Sea-Mattress',
  item_category: 'water games',
  item_variant: 'Adult supervision',
  price: 120 + '$',
  amount: 0
};


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

  //An array of store item names.
  var items = [puzzel_nature, puzzel_animal, monopoly, rummikub, ring_toss, bowling, kite, water_gun, sea_tools, sea_mattress];

  //Receive the updated array from another page.
  items = JSON.parse(sessionStorage.getItem("items"));
  if (!items) {
    items = [puzzel_nature, puzzel_animal, monopoly, rummikub, ring_toss, bowling, kite, water_gun, sea_tools, sea_mattress];
  }
  
  //Change the quantity of the specific product approximately by pressing the appropriate button.
  $("#addNature_puzzel").on("click", function () {
    items[0]["amount"]++;
    console.log(items);
  });

  $("#addAnimal_puzzel").on("click", function () {
    items[1]["amount"]++;
    console.log(items);
  });

  $("#addMonopoly").on("click", function () {
    items[2]["amount"]++;
    console.log(items);
  });

  $("#addRummikub").on("click", function () {
    items[3]["amount"]++;
    console.log(items);
  });

  $("#addRing-toss").on("click", function () {
    items[4]["amount"]++;
    console.log(items);
  });

  $("#addBowling").on("click", function () {
    items[5]["amount"]++;
    console.log(items);
  });

  $("#addKite").on("click", function () {
    items[6]["amount"]++;
    console.log(items);
  });

  $("#addWater-Gun").on("click", function () {
    items[7]["amount"]++;
    console.log(items);
  });

  $("#addSea-Tools").on("click", function () {
    items[8]["amount"]++;
    console.log(items);
  });

  $("#addSea-Mattress").on("click", function () {
    items[9]["amount"]++;
    console.log(items);
  });


  //Sending the updated array to the order execution page.
  $("#passArrayToCheckout").on("click", function () {
    sessionStorage.setItem("items", JSON.stringify(items));
  });

  //Sending the updated array to the home page.
  $("#passArrayToHome").on("click", function () {
    sessionStorage.setItem("items", JSON.stringify(items));
  });

});






