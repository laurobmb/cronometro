# Relógio Digital com Alarme em Go e JavaScript

Este é um projeto de uma aplicação web que exibe um relógio digital funcional com um sistema de alarme. O backend é construído em Go (Golang) para servir a página e registrar os alarmes, enquanto o frontend utiliza HTML, CSS e JavaScript para criar uma interface dinâmica e interativa para o usuário.

## Funcionalidades

* **Relógio em Tempo Real**: Exibe a hora atual no formato 12 horas (AM/PM), atualizada a cada segundo.
* **Registro de Alarmes**: Permite que o usuário defina múltiplos alarmes em horários específicos.
* **Alarmes Predefinidos**: Botões de acesso rápido para definir um alarme para daqui a 1, 5, 10, 20, 30, 40, 50 minutos ou 1 hora.
* **Seleção de Som**: O usuário pode escolher entre 4 sons de alarme diferentes.
* **Controle do Alarme**: Um botão "Parar Alarme" aparece quando um alarme é acionado.
* **Lista de Alarmes Inteligente**:
    * Os alarmes são automaticamente ordenados na lista para mostrar o mais próximo a tocar no topo.
    * Alarmes que já foram executados no dia são marcados em vermelho e tachados para fácil identificação.
* **Interface Moderna**: Layout escuro e estilizado com um ícone ao lado do título.
* **Logging no Servidor**: O backend em Go registra todas as requisições recebidas, facilitando a depuração e o monitoramento.

## Estrutura do Projeto

```

/relogio-alarme/
|
|-- main.go                \# Servidor backend em Go
|
|-- /templates/
|   |-- index.html         \# Estrutura principal da página web
|
|-- /static/
|-- /css/
|   |-- style.css      \# Folha de estilos para a aparência da página
|
|-- /js/
|   |-- script.js      \# Lógica do frontend (relógio, alarmes, interações)
|
|-- /audio/
|   |-- alarm\_1.mp3    \# Arquivos de som para os alarmes
|   |-- alarm\_2.mp3
|   |-- alarm\_3.mp3
|   |-- alarm\_4.mp3
|
|-- /images/
|-- alarm-clock-icon.png \# Ícone exibido no título

````

## Como Executar

### Pré-requisitos

* É necessário ter o [Go](https://golang.org/dl/) instalado em seu sistema.

### Passos

1.  **Clone ou baixe os arquivos** para um diretório em seu computador.
2.  **Organize os arquivos** seguindo a estrutura de projeto descrita acima. Certifique-se de que os 4 arquivos de áudio `.mp3` e o arquivo de imagem `.png` estejam nas pastas corretas (`/static/audio/` e `/static/images/`).
3.  **Abra o terminal** e navegue até o diretório raiz do projeto (`relogio-alarme`).
4.  **Execute o servidor** com o seguinte comando:
    ```bash
    go run main.go
    ```
5.  **Acesse a aplicação**: Abra seu navegador e acesse o endereço `http://localhost:8080`.

## Tecnologias Utilizadas

* **Backend**: Go (usando os pacotes `net/http`, `html/template`, `log`, `sync` e `time`)
* **Frontend**: HTML5, CSS3, JavaScript (ES6)
