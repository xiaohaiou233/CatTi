const gifLink=[
    "assets/test1.gif",
    "assets/test2.gif",
];

const catImage = document.getElementById("pixel_cat");
const randomIndex = Math.floor(Math.random() * gifLink.length);
catImage.src = gifLink[randomIndex];

