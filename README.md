link google drive da apresentação:
https://drive.google.com/file/d/1y3EYxNYOSBV8udMR5j0I27LV_BKW6z9k/view?usp=sharing

Relatório de Desenvolvimento do Projeto
Falkon Store

Método de instalação
Extrair o arquivo, abrir a pasta pelo vscode e no terminal integrado do projeto:
npm install
npm run dev
obs.: caso queira testar o banco de dados local, é necessário limpar o “Local storage” apertando F12 e indo em “application”.

Introdução
A Falkon Store é uma aplicação web desenvolvida em React com foco em prática de conceitos fundamentais do desenvolvimento front-end moderno. O projecto simula uma loja virtual temática, com navegação entre páginas, listagem de produtos, promoções, carrinho de compras, autenticação e acompanhamento de pedidos.
O relatório original já destacava o objetivo de aplicar conhecimentos sobre React, componentes, rotas e gerenciamento de estado. A análise do projeto mostra que a implementação foi além da vitrine básica, incluindo organização por contextos, persistência de dados no navegador e regras de negócio para estoque e pedidos.
Desenvolvimento
O projeto foi estruturado com React, Vite e React Router DOM, o que permitiu uma experiência rápida de desenvolvimento e uma navegação fluida entre telas. A aplicação é composta por uma camada principal de rotas em App.jsx, além de páginas e componentes bem separados em pastas próprias.
A organização do código privilegia a reutilização. Elementos visuais como Navbar e ProductCard foram isolados em componentes independentes, enquanto o estado global foi distribuído entre contextos específicos: AuthContext para autenticação, CartContext para o carrinho, EstoqueContext para controle de estoque e PedidosContext para criação e acompanhamento dos pedidos.
Também foi criada uma base local de dados em db.js, utilizando localStorage. Com isso, informações como usuário logado, itens do carrinho, pedidos e estoque permanecem salvas mesmo após fechar a aba ou reiniciar o servidor local.


Estrutura e organização do projecto
A estrutura do projecto conta com os seguintes blocos principais:
- src/data/produtos.js: catálogo com 16 produtos e 7 categorias;
- src/pages/: páginas de busca, promoções, login, carrinho e pedidos;
- src/components/: elementos reutilizáveis da interface;
- src/context/: gerenciamento centralizado de estado;
- src/db/db.js: camada simples de persistência no navegador.
Essa divisão facilita manutenção, leitura e evolução do sistema. Caso novas funcionalidades sejam adicionadas no futuro, a organização atual já oferece uma base clara para expansão.
Funcionalidades implementadas
Entre as funcionalidades implementadas, destaca-se o sistema de autenticação. O login utiliza uma credencial pré-cadastrada, com acesso restrito às páginas internas por meio de ProtectedRoute. Quando o utilizador não está autenticado, é redirecionado para a tela de acesso.
A vitrine principal, chamada Busca, permite pesquisar produtos por nome, descrição ou categoria. Também há filtros por categoria, por itens em promoção e opções de ordenação por relevância, menor preço, maior preço e desconto. Isso torna a navegação mais útil e próxima de uma loja virtual real.
A página de promoções apresenta somente produtos marcados com promocao: true, calculando automaticamente a maior taxa de desconto e a economia total da lista. Já os cards de produto exibem selo promocional, badge de desconto, estado de esgotado e prevenção de adição acima do estoque disponível.


Carrinho, pedidos e estoque
O carrinho de compras foi desenvolvido para permitir a adição, remoção e atualização de quantidades. O total é calculado automaticamente com base nos itens selecionados. Na finalização, a aplicação aplica as regras do método de pagamento escolhido: PIX com desconto, crédito com possibilidade de parcelamento, débito e boleto.
Ao concluir a compra, o sistema cria um pedido com identificador próprio, grava os dados no armazenamento local e limpa o carrinho. Em seguida, o utilizador pode acompanhar o pedido na página Meus Pedidos, que exibe uma linha de progresso com etapas como pagamento confirmado, separação, a caminho e entregue.
Outro ponto importante é o controle de estoque. A quantidade disponível de cada produto é reduzida ao finalizar a compra, evitando inconsistências básicas de compra dentro da própria aplicação.
Resultados obtidos
Ao final, o projecto entrega uma experiência funcional e coerente com os objetivos iniciais. A Falkon Store consegue apresentar produtos, destacar promoções, proteger áreas internas, registrar compras e simular acompanhamento de encomendas.
Além do funcionamento prático, o projecto demonstra boa aplicação de conceitos aprendidos em React, como componentes reutilizáveis, state lifting, contexto, rotas protegidas e persistência local. O resultado é uma base sólida para um sistema front-end mais completo.
Considerações finais
Como possibilidade de evolução, seria interessante integrar uma API real para os produtos, substituir o armazenamento local por um backend com banco de dados, implementar autenticação completa de usuários e adicionar histórico detalhado de pedidos.
De forma geral, a Falkon Store representa um projecto didático consistente, útil para consolidar conteúdos de front-end e para demonstrar a construção de uma aplicação web moderna com React.



Grupo: Renan Floriano, Elian Dalmolin & Jhonatan Inacio.
