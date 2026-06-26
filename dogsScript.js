async function getDogPics() {
    try {
        let str = "";
        for (let i = 0; i < 10; i++) {
            const response = await fetch(
                'https://dog.ceo/api/breeds/image/random',
            );
            resJSON = await response.json();
            str += `<div class=\"swiper-slide\"><img src=\"${resJSON.message}\"></div>`;
        }

        document.getElementsByClassName("swiper-wrapper")[0].innerHTML = str;

        const swiper = new Swiper('.swiper', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    } catch (e) {
        console.error('An error happened:', e);
    }
}

getDogPics();

let breedCache = [];

async function getBreeds() {
    try {
        const response = await fetch(
            "https://dogapi.dog/api/v2/breeds"
        );
        const resJSON = await response.json();

        breedCache = resJSON.data;
        renderButtons(breedCache.slice(0, 10));

    } catch (e) {
        console.error("An error happened:", e);
    }
}

getBreeds();

function renderButtons(breeds) {
    const container = document.getElementById("dogButtons");
    container.innerHTML = "";
    
    const colors = ["pink", "moccasin", "lemonchiffon", "greenyellow", "palegreen", "aquamarine", "paleturquoise", "lightsteelblue", "thistle", "lavender"];

    breeds.forEach((breed, index) => {
        const button = document.createElement("button");
        button.className = "button-54";
        button.style.backgroundColor = colors[index % colors.length];
        button.textContent = breed.attributes.name;

        button.addEventListener("click", () => {
            showBreedInfo(breed);
        });

        container.appendChild(button);
    });
}

function showBreedInfo(breed) {
    document.getElementById("breedInfo").innerHTML = `
        <h1>Name: ${breed.attributes.name}</h1>
        <h2>Description: ${breed.attributes.description}</h2>
        <h2>Min Life: ${breed.attributes.life.min}</h2>
        <h2>Max Life: ${breed.attributes.life.max}</h2>
    `;
    document.getElementById("breedInfo").style.visibility = "visible";
}

function loadBreed(name) {
    const matches = breedCache.filter(breed =>
        breed.attributes.name.toLowerCase().includes(name.toLowerCase())
    );
    showBreedInfo(matches[0]);
}

function turnOnListening() {
    if (annyang.isSpeechRecognitionSupported()) {
        // Let's define a command.
        const commands = {
            'load dog breed *name': (name) => { loadBreed(name); },
            'hello': () => { alert('Hello!'); },
            'change the color to *color': (color) => { document.body.style.backgroundColor = `${color}`; },
            'navigate to *page': (page) => {
                if (page == "home") {
                    window.location.href = "home.html";
                } else if (page == "stocks") {
                    window.location.href = "stocks.html";
                } else {
                    window.alert("Please try again.")
                }
            }
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        // Start listening
        annyang.start();

        // Remember that listening was turned on
        localStorage.setItem("voiceEnabled", "true");
    }
}

function turnOffListening() {
    annyang.abort();
    localStorage.removeItem("voiceEnabled");
}

window.addEventListener("load", () => {
    if (localStorage.getItem("voiceEnabled")) {
        turnOnListening();
    }
});