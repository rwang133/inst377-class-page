async function searchStocks() {
    const today = new Date();
    let ticker = document.forms['stocksForm']['ticker'].value.toUpperCase();

    //Swedish locale uses ISO format by default
    const to = today.toLocaleDateString('sv');
    today.setDate(today.getDate() - parseInt(document.forms['stocksForm']['days'].value));
    const from = today.toLocaleDateString('sv');

    try {
        const response = await fetch(
            `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?&apiKey=PgMJw7kKOj3iQImt3h7EiCI7owLDCzAh`,
        );
        resJSON = await response.json();

        dates = [];
        prices = [];
        resJSON.results.forEach(res => {
            dates.push((new Date(res.t)).toLocaleDateString('sv'));
            prices.push(res.c);
        });

        
        let chartStatus = Chart.getChart("myChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        const ctx = document.getElementById('myChart');
        let stocksChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '($) Stock Price',
                    data: prices,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        ctx.style.visibility = "visible";
    } catch (e) {
        console.error('An error happened:', e);
    }
}

async function getTable() {
    try {
        const response = await fetch(
                'https://apewisdom.io/api/v1.0/filter/all-stocks/page/1',
            );
        resJSON = await response.json();

        let str = "<tr><th>Ticker</th><th>Comment Count</th><th>Sentiment</th></tr>";
        for (let i = 0; i < 5; i++) {
            str += `<tr><td><a href=\"https://finance.yahoo.com/quote/${resJSON.results[i].ticker}/\">${resJSON.results[i].ticker}</a></td><td>${resJSON.results[i].mentions}</td>`
            if (resJSON.results[i].upvotes > 1) {
                str += "<td><img src=\"https://images.cults3d.com/d5mjmo3ubVe2p6Qc7hPKdUIyGOw=/516x516/filters:no_upscale():format(webp)/https://fbi.cults3d.com/uploaders/15255787/illustration-file/62fff38d-38ae-49c3-8a46-c14c7947880a/Cute-Bull-1.png\"></td>";
            } else {
                str += "<td><img src=\"https://images.cults3d.com/0ateNh2XvRY67Wvcl7iIAAiyWKk=/516x516/filters:no_upscale():format(webp)/https://fbi.cults3d.com/uploaders/15255787/illustration-file/78e2bc5a-ffa8-4336-92a7-645cd3a3c53b/Cod246-Walking-Bear-1.png\"></td>";
            }
            str += "</tr>";
        }
        
        document.getElementById("top5").innerHTML = str;
    } catch (e) {
        console.error('An error happened:', e);
    }
}

getTable();

function turnOnListening() {
        if (annyang.isSpeechRecognitionSupported()) {
            // Let's define a command.
            const commands = {
                'look up *ticker': (ticker) => { document.forms['stocksForm']['ticker'].value = ticker; searchStocks(); console.log(ticker);},
                'hello': () => { alert('Hello!'); },
                'change the color to *color': (color) => { document.body.style.backgroundColor = `${color}`; },
                'navigate to *page': (page) => {
                    if (page == "home") {
                        window.location.href = "home.html";
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