function calculaMedia(valor, quantidade) {
  var media = 0;
  media = valor / quantidade;
  return media.toFixed(2);
}

function separaRegioesPorUf(ufs) {

  var norte = ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'];
  var nordeste = ['MA', 'PI', 'CE', 'RN', 'PE', 'PB', 'SE', 'AL', 'BA'];
  var centroOeste = ['MT', 'MS', 'GO'];
  var sudeste = ['SP', 'RJ', 'MG', 'ES'];

  var countNorte = 0;
  var countNordeste = 0;
  var countCentroOeste = 0;
  var countSudeste = 0;
  var countSul = 0;

  $.each(ufs, function (index, value) {
    if ($.inArray(value, norte) !== -1) { countNorte++; }
    else if ($.inArray(value, nordeste) !== -1) { countNordeste++; }
    else if ($.inArray(value, centroOeste) !== -1) { countCentroOeste++; }
    else if ($.inArray(value, sudeste) !== -1) { countSudeste++; }
    else { countSul++; }
  });

  var resultado = { 'norte': countNorte, 'nordeste': countNordeste, 'centroOeste': countCentroOeste, 'sudeste': countSudeste, 'sul': countSul }
  return resultado;
}

function fazRequisicao(dados, contador) {
  //A requisição está como síncrona devido a quantidade de dados, tendo de ser feita uma nova requisição sempre que uma acabar
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://brasil.io/api/dataset/cursos-prouni/cursos/data?grau=" + dados.grau + "&universidade_nome=" + dados.universidade_nome + "&cidade_busca=" + dados.cidade_busca + "&nome=" + dados.nome + "&page=" + contador,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  var result = $.ajax(settings).done(function (response) { });
  return result.responseJSON;
}

$('#geraRelatorio').submit(function (event) {

  //cancela o submit do formulário
  event.preventDefault();

  //exite o gif enquanto gera o relatório
  $('#carregando').show();
  $('#relatorio').hide();

  //caso já exista uma tabela gerada antes, destrói a tabela antiga para o datatable criar uma nova posteriormente
  if (!$('#corpo-tabela').is(':empty')) {
    $('#tabela').DataTable().destroy();
    $('#corpo-tabela').html('');
  }

  //inicialização das variáveis
  var totalMensalidade = 0;
  var universidade = [];
  var totalNotaIntegralAmpla = 0;
  var totalNotaIntegralCota = 0;
  var uf = [];
  var resultadosReq = [];
  var contador = 1;
  var aux = 0;

  //dados do formulário que serão utilizados para montar a URL da requisição
  var dadosRequisicao = {
    'grau': $('#grau').val(),
    'universidade_nome': $('#universidade').val(),
    'cidade_busca': $('#cidade').val(),
    'nome': $('#curso').val()
  }

  //aloca os valores recebidos do slider em formado de double/float
  var valorMin = parseFloat(slider.noUiSlider.get()[0] + '.00');
  var valorMax = parseFloat(slider.noUiSlider.get()[1] + '.00');

  //Executa a primeira requisição buscando a primeira página
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://brasil.io/api/dataset/cursos-prouni/cursos/data?grau=" + dadosRequisicao.grau + "&universidade_nome=" + dadosRequisicao.universidade_nome + "&cidade_busca=" + dadosRequisicao.cidade_busca + "&nome=" + dadosRequisicao.nome + "&page=" + contador,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {
    var resultado = fazRequisicao(dadosRequisicao, contador);
    resultadosReq.push(resultado);

    //caso tenha página seguinte, um while será executado percorrendo todas seguintes páginas
    if (resultado.next != null) {

      contador++;
      var stop = false;

      while (stop == false) {

        resultado = fazRequisicao(dadosRequisicao, contador);
        resultadosReq.push(resultado);

        if (resultado.next != null) {
          contador++;
        } else {
          stop = true;
        }
      }
    }

    //percorre todos os resultados obtidos no while
    for (let i = 0; i < resultadosReq.length; i++) {
      $.each(resultadosReq[i].results, function (index, value) {

        //caso o valor da mensalidade do curso esteja dentro os valores pré-estabelecidos no slider, executa o bloco abaixo
        if (value.mensalidade >= valorMin && value.mensalidade <= valorMax) {

          //cria uma nova <tr>
          criaLinhaTabela(aux, value);

          //valida se existe valor na posição antes de somar, caso tenha, realiza soma
          if (value.nota_integral_ampla != null) {
            totalNotaIntegralAmpla = parseFloat(totalNotaIntegralAmpla) + parseFloat(value.nota_integral_ampla);
          }
          if (value.nota_integral_cotas != null) {
            totalNotaIntegralCota = parseFloat(totalNotaIntegralCota) + parseFloat(value.nota_integral_cotas);
          }
          //acumula o valor da mensalidade
          totalMensalidade = parseFloat(totalMensalidade) + parseFloat(value.mensalidade);
          //acumula todas universidades em um array
          universidade.push(value.universidade_nome);
          //acumula todas universidades em um array
          uf.push(value.uf_busca);
          aux++;
        }
      });
    }

    //remove valores duplicados do array
    var universidades = [...new Set(universidade)];

    //a variável quantidade é utilizada tanto para calcular as médias quanto o total de cursos
    var quantidade = resultadosReq[0].count;

    //atribui os resultados aos seus respectivos elementos
    $('#mediaMensalidade').html('R$' + (calculaMedia(totalMensalidade.toFixed(2), quantidade)));
    $('#mediaNotaIntegralAmpla').html(calculaMedia(totalNotaIntegralAmpla.toFixed(2), quantidade));
    $('#mediaNotaIntegralCota').html(calculaMedia(totalNotaIntegralCota.toFixed(2), quantidade));
    $('#totalUniversidade').html(universidades.length);
    $('#totalCurso').html(quantidade);

    //Separa os Estados nas suas devidas Regiões
    var dadosRegioes = separaRegioesPorUf(uf);
    geraGrafico(dadosRegioes);

    //faz a chamada do método responsável por gerar o datatable
    configuraTabela();
  });
});