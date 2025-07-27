// Dados e estado
let tarefas = [];
let categorias = [];
let filtroCategoria = 'Todas';
let filtroStatus = 'Todas';
let termoBusca = '';
const CATEGORIAS_PADRAO = ['Trabalho', 'Pessoal', 'Urgente', 'Estudos'];

// Estado de paginação
let paginaAtual = 1;
let paginacaoAtiva = true; // true = paginado, false = ver todos
const TAREFAS_POR_PAGINA = 5;

// Estado de edição
let editandoTarefa = null;
let modoEdicao = false;

// Estado do tema
let temaAtual = 'claro';

// Utilidades
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
function carregarTarefas() {
  const salvas = localStorage.getItem('tarefas');
  tarefas = salvas ? JSON.parse(salvas) : [];
}
function salvarCategorias() {
  localStorage.setItem('categorias', JSON.stringify(categorias));
}
function carregarCategorias() {
  const salvas = localStorage.getItem('categorias');
  categorias = salvas ? JSON.parse(salvas) : [...CATEGORIAS_PADRAO];
}
function gerarId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
function formatarData(dataISO) {
  const d = new Date(dataISO);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Renderização de categorias
function renderizarCategorias() {
  // Select do formulário
  const select = document.getElementById('categoria');
  select.innerHTML = '';
  categorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  // Filtros de categoria
  const filtros = document.getElementById('filtro-categorias');
  filtros.innerHTML = '';
  
  const btnTodas = document.createElement('button');
  btnTodas.type = 'button';
  btnTodas.dataset.categoria = 'Todas';
  btnTodas.textContent = 'Todas';
  btnTodas.className = `button ${filtroCategoria === 'Todas' ? 'is-primary' : 'is-light'}`;
  btnTodas.addEventListener('click', () => filtrarTarefasCategoria('Todas'));
  filtros.appendChild(btnTodas);
  
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.categoria = cat;
    btn.textContent = cat;
    btn.className = `button ${filtroCategoria === cat ? 'is-primary' : 'is-light'}`;
    btn.addEventListener('click', () => filtrarTarefasCategoria(cat));
    filtros.appendChild(btn);
    
    // Só adiciona botão de remoção para categorias não padrão
    if (!CATEGORIAS_PADRAO.includes(cat)) {
      const btnRemover = document.createElement('button');
      btnRemover.type = 'button';
      btnRemover.className = 'button is-danger is-small';
      btnRemover.innerHTML = '&times;';
      btnRemover.title = 'Remover categoria';
      btnRemover.addEventListener('click', () => removerCategoria(cat));
      filtros.appendChild(btnRemover);
    }
  });
}

// Verificar se categoria está em uso
function categoriaEmUso(categoria) {
  return tarefas.some(t => t.categoria === categoria);
}

// Remover categoria
function removerCategoria(categoria) {
  const tarefasComCategoria = tarefas.filter(t => t.categoria === categoria);
  
  if (tarefasComCategoria.length > 0) {
    const confirmacao = confirm(
      `A categoria "${categoria}" está sendo usada por ${tarefasComCategoria.length} tarefa(s).\n\n` +
      `Deseja remover a categoria e marcar essas tarefas como excluídas?`
    );
    
    if (!confirmacao) return;
    
    // Marcar tarefas como excluídas
    tarefasComCategoria.forEach(t => t.excluida = true);
    salvarTarefas();
  }
  
  // Remover categoria
  categorias = categorias.filter(c => c !== categoria);
  salvarCategorias();
  renderizarCategorias();
  renderizarTarefas();
}

// Renderização
function renderizarTarefas() {
  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';
  let filtradas = tarefas.filter(t => {
    // Filtro de status
    let statusOk = true;
    if (filtroStatus === 'Pendentes') statusOk = !t.concluida && !t.excluida;
    else if (filtroStatus === 'Concluídas') statusOk = t.concluida && !t.excluida;
    else if (filtroStatus === 'Excluídas') statusOk = t.excluida;
    else statusOk = !t.excluida; // 'Todas' não mostra excluídas
    const categoriaOk = filtroCategoria === 'Todas' || t.categoria === filtroCategoria;
    const buscaOk = t.titulo.toLowerCase().includes(termoBusca.toLowerCase());
    return categoriaOk && statusOk && buscaOk;
  });

  // Paginação
  let tarefasParaExibir = filtradas;
  const paginacaoDiv = document.getElementById('paginacao-tarefas');
  paginacaoDiv.innerHTML = '';
  if (paginacaoAtiva && filtradas.length > TAREFAS_POR_PAGINA) {
    const totalPaginas = Math.ceil(filtradas.length / TAREFAS_POR_PAGINA);
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
    const inicio = (paginaAtual - 1) * TAREFAS_POR_PAGINA;
    const fim = inicio + TAREFAS_POR_PAGINA;
    tarefasParaExibir = filtradas.slice(inicio, fim);
    // Botão Ver todos
    const btnTodos = document.createElement('button');
    btnTodos.textContent = 'Ver todos';
    btnTodos.onclick = () => { paginacaoAtiva = false; renderizarTarefas(); };
    btnTodos.style = 'padding:0.4rem 1rem;border-radius:7px;border:1.5px solid #2563eb;background:#fff;color:#2563eb;font-weight:600;cursor:pointer;';
    paginacaoDiv.appendChild(btnTodos);
    // Botões de página
    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.disabled = i === paginaAtual;
      btn.onclick = () => { paginaAtual = i; renderizarTarefas(); };
      btn.style = `padding:0.4rem 0.9rem;border-radius:7px;border:1.5px solid #2563eb;background:${i===paginaAtual?'#2563eb':'#fff'};color:${i===paginaAtual?'#fff':'#2563eb'};font-weight:600;cursor:pointer;`;
      paginacaoDiv.appendChild(btn);
    }
  } else if (filtradas.length > TAREFAS_POR_PAGINA) {
    // Botão paginado
    const btnPaginado = document.createElement('button');
    btnPaginado.textContent = 'Paginado';
    btnPaginado.onclick = () => { paginacaoAtiva = true; paginaAtual = 1; renderizarTarefas(); };
    btnPaginado.style = 'padding:0.4rem 1rem;border-radius:7px;border:1.5px solid #2563eb;background:#fff;color:#2563eb;font-weight:600;cursor:pointer;';
    paginacaoDiv.appendChild(btnPaginado);
  }

  if (tarefasParaExibir.length === 0) {
    lista.innerHTML = '<li style="text-align:center;color:#888;padding:2rem 0;">Nenhuma tarefa encontrada.</li>';
  } else {
    tarefasParaExibir.forEach(tarefa => {
      const li = document.createElement('li');
      li.className = 'tarefa';
      li.setAttribute('data-id', tarefa.id);
      li.innerHTML = `
        <input type="checkbox" ${tarefa.concluida ? 'checked' : ''}>
        <div class="tarefa-conteudo">
          <div class="tarefa-titulo${tarefa.concluida ? ' concluida' : ''}">${tarefa.titulo}
            <span class="badge ${tarefa.categoria}">${tarefa.categoria}</span>
          </div>
          ${tarefa.descricao ? `<div class="tarefa-descricao">${tarefa.descricao}</div>` : ''}
          <div class="tarefa-data">
            <div><strong>Criada:</strong> ${formatarData(tarefa.datacriacao)}</div>
            ${tarefa.datamodificacao ? `<div><strong>Modificada:</strong> ${formatarData(tarefa.datamodificacao)}</div>` : ''}
            ${tarefa.dataconclusao ? `<div><strong>Concluída:</strong> ${formatarData(tarefa.dataconclusao)}</div>` : ''}
            ${tarefa.dataexclusao ? `<div><strong>Excluída:</strong> ${formatarData(tarefa.dataexclusao)}</div>` : ''}
          </div>
        </div>
        <div class="tarefa-botoes">
          ${!tarefa.concluida && !tarefa.excluida ? `<button class="btn-editar" title="Editar tarefa" aria-label="Editar tarefa">✏️</button>` : ''}
          <button class="btn-excluir" title="Excluir tarefa" aria-label="Excluir tarefa">&#10005;</button>
        </div>
      `;
      // Checkbox
      li.querySelector('input[type="checkbox"]').addEventListener('change', () => alternarConclusao(tarefa.id));
      // Excluir
      li.querySelector('.btn-excluir').addEventListener('click', () => excluirTarefaAnimada(tarefa.id, li));
      // Editar (apenas para tarefas pendentes)
      const btnEditar = li.querySelector('.btn-editar');
      if (btnEditar) {
        btnEditar.addEventListener('click', () => editarTarefa(tarefa));
      }
      lista.appendChild(li);
    });
  }
  atualizarContadores();
}

function atualizarContadores() {
  const pendentes = tarefas.filter(t => !t.concluida && !t.excluida).length;
  const concluidas = tarefas.filter(t => t.concluida && !t.excluida).length;
  const excluidas = tarefas.filter(t => t.excluida).length;
  document.getElementById('footer-contador').textContent = `${pendentes} pendentes | ${concluidas} concluídas | ${excluidas} excluídas`;
}

// Funções principais
function adicionarTarefa(e) {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const categoriaSelect = document.getElementById('categoria');
  const categoria = categoriaSelect.value;
  if (!titulo) return;
  
  if (modoEdicao && editandoTarefa) {
    // Modo de edição - atualizar tarefa existente
    editandoTarefa.titulo = titulo;
    editandoTarefa.descricao = descricao;
    editandoTarefa.categoria = categoria;
    editandoTarefa.datamodificacao = new Date().toISOString();
    salvarTarefas();
    cancelarEdicao();
  } else {
    // Modo de adição - criar nova tarefa
    const nova = {
      id: gerarId(),
      titulo,
      descricao,
      categoria,
      concluida: false,
      excluida: false,
      datacriacao: new Date().toISOString(),
      datamodificacao: null,
      dataconclusao: null,
      dataexclusao: null
    };
    tarefas.unshift(nova);
    salvarTarefas();
  }
  
  paginacaoAtiva = true;
  paginaAtual = 1;
  renderizarTarefas();
  document.getElementById('form-tarefa').reset();
  categoriaSelect.value = categoria; // Mantém a categoria selecionada
  document.getElementById('titulo').focus();
}
function adicionarCategoria() {
  const input = document.getElementById('nova-categoria');
  let nova = input.value.trim();
  if (!nova) return;
  // Normalizar: primeira letra maiúscula, resto minúsculo
  nova = nova.charAt(0).toUpperCase() + nova.slice(1);
  if (categorias.includes(nova)) {
    input.value = '';
    input.focus();
    return;
  }
  categorias.push(nova);
  salvarCategorias();
  renderizarCategorias();
  input.value = '';
  document.getElementById('categoria').value = nova;
  document.getElementById('categoria').focus();
}
function excluirTarefaAnimada(id, li) {
  li.classList.add('removendo');
  setTimeout(() => {
    excluirTarefa(id);
  }, 320);
}
function excluirTarefa(id) {
  // Se estiver editando a tarefa que está sendo excluída, cancelar edição
  if (modoEdicao && editandoTarefa && editandoTarefa.id === id) {
    cancelarEdicao();
  }
  
  // Se estiver no filtro "Excluídas", remove permanentemente
  if (filtroStatus === 'Excluídas') {
    if (confirm('Deseja remover esta tarefa permanentemente?')) {
      tarefas = tarefas.filter(t => t.id !== id);
      salvarTarefas();
      paginacaoAtiva = true;
      paginaAtual = 1;
    }
    // Sempre renderiza, mesmo se cancelou
    renderizarTarefas();
    return;
  }
  
  // Caso contrário, marca como excluída (comportamento normal)
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.excluida = true;
    tarefa.dataexclusao = new Date().toISOString();
    tarefa.datamodificacao = new Date().toISOString();
    salvarTarefas();
    paginacaoAtiva = true;
    paginaAtual = 1;
    renderizarTarefas();
  }
}

// Excluir tudo logicamente
function excluirTudo() {
  if (tarefas.length === 0) return;
  if (confirm('Tem certeza que deseja excluir TODAS as tarefas?')) {
    tarefas.forEach(t => t.excluida = true);
    salvarTarefas();
    paginacaoAtiva = true;
    paginaAtual = 1;
    renderizarTarefas();
  }
}

function alternarConclusao(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
    if (tarefa.concluida) {
      tarefa.dataconclusao = new Date().toISOString();
    } else {
      tarefa.dataconclusao = null;
    }
    tarefa.datamodificacao = new Date().toISOString();
    salvarTarefas();
    paginacaoAtiva = true;
    paginaAtual = 1;
    renderizarTarefas();
  }
}
function filtrarTarefasCategoria(categoria) {
  filtroCategoria = categoria;
  paginacaoAtiva = true;
  paginaAtual = 1;
  renderizarCategorias();
  renderizarTarefas();
}
function filtrarTarefasStatus(status) {
  filtroStatus = status;
  document.querySelectorAll('#filtro-status button').forEach(btn => {
    btn.classList.remove('is-primary');
    btn.classList.add('is-light');
    if (btn.dataset.status === status) {
      btn.classList.remove('is-light');
      btn.classList.add('is-primary');
    }
  });
  // Mostrar/ocultar botão Limpar baseado no status
  const btnLimpar = document.getElementById('btn-limpar-excluidas');
  if (status === 'Excluídas') {
    btnLimpar.style.display = 'block';
  } else {
    btnLimpar.style.display = 'none';
  }
  renderizarTarefas();
}
function buscarTarefas(termo) {
  termoBusca = termo;
  paginacaoAtiva = true;
  paginaAtual = 1;
  renderizarTarefas();
}

// Limpar tarefas excluídas permanentemente
function limparTarefasExcluidas() {
  const tarefasExcluidas = tarefas.filter(t => t.excluida);
  if (tarefasExcluidas.length === 0) {
    alert('Não há tarefas excluídas para limpar.');
    return;
  }
  
  if (confirm(`Tem certeza que deseja remover permanentemente ${tarefasExcluidas.length} tarefa(s) excluída(s)?\n\nEsta ação não pode ser desfeita.`)) {
    tarefas = tarefas.filter(t => !t.excluida);
    salvarTarefas();
    renderizarTarefas();
    alert(`${tarefasExcluidas.length} tarefa(s) removida(s) permanentemente.`);
  }
}

// Editar tarefa
function editarTarefa(tarefa) {
  modoEdicao = true;
  editandoTarefa = tarefa;
  
  // Preencher formulário com dados da tarefa
  document.getElementById('titulo').value = tarefa.titulo;
  document.getElementById('descricao').value = tarefa.descricao;
  document.getElementById('categoria').value = tarefa.categoria;
  
  // Atualizar interface
  document.getElementById('btn-submit').textContent = 'Atualizar Tarefa';
  document.getElementById('btn-submit').classList.remove('is-link');
  document.getElementById('btn-submit').classList.add('is-warning');
  document.getElementById('btn-cancelar-edicao').style.display = 'block';
  
  // Focar no título
  document.getElementById('titulo').focus();
}

// Cancelar edição
function cancelarEdicao() {
  modoEdicao = false;
  editandoTarefa = null;
  
  // Limpar formulário
  document.getElementById('form-tarefa').reset();
  
  // Restaurar interface
  document.getElementById('btn-submit').textContent = 'Adicionar Tarefa';
  document.getElementById('btn-submit').classList.remove('is-warning');
  document.getElementById('btn-submit').classList.add('is-link');
  document.getElementById('btn-cancelar-edicao').style.display = 'none';
}

// Funções de tema
function carregarTema() {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo) {
    temaAtual = temaSalvo;
    aplicarTema(temaAtual);
  }
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema === 'escuro' ? 'escuro' : 'claro');
  const iconeTema = document.getElementById('icone-tema');
  iconeTema.textContent = tema === 'escuro' ? '☀️' : '🌙';
  temaAtual = tema;
  localStorage.setItem('tema', tema);
}

function alternarTema() {
  const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
  aplicarTema(novoTema);
}

// Event listeners
document.getElementById('form-tarefa').addEventListener('submit', adicionarTarefa);
document.getElementById('btn-add-categoria').addEventListener('click', adicionarCategoria);
document.getElementById('nova-categoria').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    adicionarCategoria();
  }
});
document.querySelectorAll('#filtro-status button').forEach(btn => {
  btn.addEventListener('click', () => filtrarTarefasStatus(btn.dataset.status));
});
document.getElementById('busca').addEventListener('input', e => buscarTarefas(e.target.value));
document.getElementById('btn-excluir-tudo').addEventListener('click', excluirTudo);
document.getElementById('btn-limpar-excluidas').addEventListener('click', limparTarefasExcluidas);
document.getElementById('btn-cancelar-edicao').addEventListener('click', cancelarEdicao);
document.getElementById('btn-tema').addEventListener('click', alternarTema);

// Inicialização
carregarTema();
carregarCategorias();
carregarTarefas();
renderizarCategorias();
renderizarTarefas(); 