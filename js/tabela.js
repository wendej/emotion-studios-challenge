
//Adiciona as classes fundamentais do datatable
$('#tabela').addClass('responsive');
$('#tabela').addClass('nowrap');

//Função responsável por inserir uma nova <tr> na tabela
function criaLinhaTabela(idLinha, dados) {

    //Devido a grande quantidade de colunas, a função ficou extensa
    $('#corpo-tabela').append($('<tr>', {
        id: 'linha-' + idLinha
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.uf_busca
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.cidade_busca
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.universidade_nome
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.campus_nome
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.nome
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.grau
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.turno
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: 'R$ ' + dados.mensalidade
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.bolsa_integral_cotas
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.bolsa_integral_ampla
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.bolsa_parcial_cotas
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.bolsa_parcial_ampla
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.nota_integral_cotas
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.nota_integral_ampla
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.nota_parcial_cotas
    }));
    $('#linha-' + idLinha).append($('<td>', {
        text: dados.nota_parcial_ampla
    }));
}

//Faz a configuração do DataTable
function configuraTabela(){
    $('#tabela').DataTable({
        //Quanto a renderização do DataTable for concluída, remove o gif e exibe os dados
        "initComplete": function () {
          $('#carregando').hide();
          $('#relatorio').show();
          //Inicializa o select do datatable com o materialize
          var elems = document.querySelectorAll('select');
          var instances = M.FormSelect.init(elems);   
        },
        //Tradução do datatable para PT-BR
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "Resultados por página _MENU_",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }
  });
}