# 📋 TaskVibe

Uma aplicação web moderna de gerenciamento de tarefas com categorias, construída com HTML, CSS e JavaScript vanilla.

![TaskVibe Screenshot](/picture/image.png)

## ✨ Funcionalidades

### 🎯 Gerenciamento de Tarefas
- ✅ Adicionar tarefas com título, descrição e categoria
- ✅ Marcar tarefas como concluídas/pendentes
- ✅ Editar tarefas pendentes
- ✅ Exclusão lógica e física de tarefas
- ✅ Busca em tempo real por título

### 🏷️ Sistema de Categorias
- ✅ Categorias padrão: Trabalho, Pessoal, Urgente, Estudos
- ✅ Adicionar categorias personalizadas
- ✅ Remover categorias (com confirmação)
- ✅ Filtros por categoria

### 🔍 Filtros e Organização
- ✅ Filtrar por status: Todas, Pendentes, Concluídas, Excluídas
- ✅ Filtrar por categoria
- ✅ Paginação (5 tarefas por página)
- ✅ Opção de visualizar todas as tarefas

### 🎨 Interface Moderna
- ✅ Design responsivo com Bulma CSS Framework
- ✅ Modo claro/escuro
- ✅ Animações suaves
- ✅ Badges coloridos para categorias
- ✅ Contadores de tarefas

### 💾 Persistência de Dados
- ✅ Armazenamento local (localStorage)
- ✅ Dados persistem entre sessões
- ✅ Histórico de modificações (datas de criação, conclusão, modificação, exclusão)

## 🚀 Como Usar

### Instalação Local
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/taskvibe-app.git
cd taskvibe-app
```

2. Abra o arquivo `index.html` no seu navegador ou use um servidor local:
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (npx)
npx serve .

# Com PHP
php -S localhost:8000
```

3. Acesse `http://localhost:8000` no seu navegador

### Uso da Aplicação
1. **Adicionar Tarefa**: Preencha o título, descrição e selecione uma categoria
2. **Gerenciar Categorias**: Adicione novas categorias ou remova existentes
3. **Filtrar**: Use os botões de filtro para organizar suas tarefas
4. **Buscar**: Digite no campo de busca para encontrar tarefas específicas
5. **Editar**: Clique no ícone ✏️ para editar tarefas pendentes
6. **Alternar Tema**: Use o botão de tema no cabeçalho

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript (ES6+)**: Lógica da aplicação
- **Bulma CSS Framework**: Componentes e layout
- **localStorage**: Persistência de dados
- **CSS Variables**: Sistema de temas

## 📱 Funcionalidades Avançadas

### Sistema de Temas
- Alternância automática entre modo claro e escuro
- Persistência da preferência do usuário
- Adaptação completa de todos os componentes

### Paginação Inteligente
- 5 tarefas por página por padrão
- Opção de visualizar todas as tarefas
- Navegação intuitiva entre páginas

### Gestão de Categorias
- Categorias padrão protegidas
- Categorias personalizadas removíveis
- Confirmação antes de remover categorias com tarefas

### Histórico Completo
- Data de criação
- Data de modificação
- Data de conclusão
- Data de exclusão

## 📁 Estrutura do Projeto

```
taskvibe-app/
├── index.html          # Página principal
├── style.css           # Estilos da aplicação
├── script.js           # Lógica JavaScript
├── README.md           # Documentação
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@viniciusvacare](https://github.com/viniciusvacare)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório! 