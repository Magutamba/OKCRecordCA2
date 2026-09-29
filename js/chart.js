//asynchronous function to fetch records from mongodb for charts
(async () => {
    const data = await fetch('/api/records').then(r => r.json());
    console.log(data);
    //extract year,wins and losses and add them to a new array
    const years = data.map(r => r.year);
    const wins = data.map(r => r.wins);
    const losses = data.map(r => r.losses);

    //get canvas element where the chart will be drawn from chart.js and w3schools
    const ctx = document.getElementById('myChart');

    //configuration for line chart
    new Chart(ctx, {
        type: 'bar',
        //x axis is years, y axis is the total number of games
        data: {
            labels: years,
            datasets: [{ label: 'Wins', data: wins, backgroundColor: "rgb(255,206,86,0.8)" },//wins colour yellow
            { label: 'Losses', data: losses, backgroundColor: "rgb(54,162,235,0.8)" }//losses colour blue
            ]
        },
        //resize to fit container and for y to begin at zero and max number of NBA regular season games 82
        options: {
            responsive: true,
            scales:
            {
                x: { ticks: { color: 'rgb(0,0,0' } },
                y: { beginAtZero: true, max: 82, ticks: { color: 'rgb(0,0,0' } }
            },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgb(0,0,0)'
                        }
                    }
                }

            }
        });
})();

