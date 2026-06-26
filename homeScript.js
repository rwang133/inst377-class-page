const api_url ="https://zenquotes.io/api/random/";

async function getapi(url)
{
  const response = await fetch(url);
  var data = await response.json();
  document.getElementById("quote").innerHTML = data[0].h;
}

getapi(api_url);

function turnOnListening() {
        if (annyang.isSpeechRecognitionSupported()) {
            // Let's define a command.
            const commands = {
                'hello': () => { alert('Hello!'); },
                'change the color to *color': (color) => { document.body.style.backgroundColor = `${color}`; },
                'navigate to *page': (page) => {
                    if (page == "stocks") {
                        window.location.href = "stocks.html";
                    } else if (page == "dogs") {
                        window.location.href = "dogs.html"
                    } else {
                        window.alert("Please try again.")
                    }
                }
            };

            // Add our commands to annyang
            annyang.addCommands(commands);

            // Start listening
            annyang.start();

            //Remember that listening was turned on
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