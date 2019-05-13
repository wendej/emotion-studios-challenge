//A escolha dessa biblioteca (https://apexcharts.com/) deu-se ao fato da simplicidade de se utilizar e o belo visual dos gráficos

function geraGrafico(dados){
    //Configura o gráfico
    var options = {
        chart: {
            width: 450,
            type: 'pie',
        },
        labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
        series: [dados.norte, dados.nordeste, dados.centroOeste, dados.sudeste, dados.sul],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 325
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    //Instacia o objeto e monta o gráfico
    var chart = new ApexCharts(
        document.querySelector("#chart"),
        options
    );

    //Renderiza o gráfico
    chart.render();
}
