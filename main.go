// main.go
package main

import (
	"fmt"
	"html/template"
	"log" // Importamos o pacote de log
	"net/http"
	"sync"
	"time" // Importamos o pacote de tempo para o log
)

// Estrutura para passar dados para o template HTML.
// Isso nos permite enviar a lista de alarmes para a página.
type PageData struct {
	Alarms []string
}

var (
	// Usaremos um slice para armazenar os horários dos alarmes em formato "HH:MM".
	alarms []string
	// Um Mutex é como um cadeado para nossos dados.
	// Ele garante que, se várias pessoas acessarem ao mesmo tempo,
	// a lista de alarmes não seja corrompida.
	alarmsMu sync.Mutex
)

// loggingMiddleware é o nosso "porteiro" que registra cada requisição.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		// Registra informações sobre a requisição que chegou.
		log.Printf(
			"Requisição recebida: Método=%s | URL=%s | IP=%s",
			r.Method,
			r.URL.Path,
			r.RemoteAddr,
		)
		// Passa a requisição para a próxima função na cadeia (o nosso handler principal).
		next.ServeHTTP(w, r)
		// Registra quanto tempo a requisição demorou para ser processada.
		log.Printf("Requisição concluída em %v", time.Since(start))
	})
}

// clockHandler é responsável por exibir a página principal.
func clockHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("-> Executando a função: clockHandler")
	// Carrega nosso arquivo HTML. Usamos Must para parar a execução se o template não for encontrado.
	tmpl := template.Must(template.ParseFiles("templates/index.html"))

	// Bloqueia o acesso à lista de alarmes para que possamos lê-la com segurança.
	alarmsMu.Lock()
	// Cria a estrutura de dados para enviar ao template.
	data := PageData{
		// É importante fazer uma cópia para evitar problemas de concorrência.
		Alarms: append([]string(nil), alarms...),
	}
	// Libera o "cadeado" dos alarmes.
	alarmsMu.Unlock()

	// "Executa" o template, ou seja, renderiza o HTML e envia para o navegador.
	// Também passamos a lista de alarmes para o template.
	err := tmpl.Execute(w, data)
	if err != nil {
		// Se houver um erro ao renderizar, informa o erro no servidor e para o cliente.
		log.Printf("ERRO: não foi possível executar o template: %v", err)
		http.Error(w, "Failed to execute template", http.StatusInternalServerError)
	}
}

// setAlarmHandler lida com o envio do formulário para adicionar um novo alarme.
func setAlarmHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("-> Executando a função: setAlarmHandler")
	// Garante que estamos recebendo um pedido do tipo POST, que é o padrão para formulários.
	if r.Method != http.MethodPost {
		http.Error(w, "Método inválido", http.StatusMethodNotAllowed)
		return
	}

	// Pega o valor do campo "alarmTime" do formulário (formato 24h, ex: "14:30").
	alarmTime24h := r.FormValue("alarmTime")
	if alarmTime24h == "" {
		http.Error(w, "Horário do alarme não pode estar vazio", http.StatusBadRequest)
		return
	}

	// Converte a string de tempo 24h para um objeto time.Time.
	parsedTime, err := time.Parse("15:04", alarmTime24h)
	if err != nil {
		log.Printf("ERRO: Formato de hora inválido recebido: %s", alarmTime24h)
		http.Error(w, "Formato de hora inválido", http.StatusBadRequest)
		return
	}
	// Formata o objeto time.Time para o formato 12h com AM/PM (ex: "02:30 PM").
	formattedAlarm := parsedTime.Format("03:04 PM")

	// Bloqueia o acesso para adicionar o novo alarme com segurança.
	alarmsMu.Lock()
	alarms = append(alarms, formattedAlarm)
	alarmsMu.Unlock()

	log.Printf("Alarme adicionado com sucesso para: %s", formattedAlarm)

	// Após adicionar, redireciona o usuário de volta para a página inicial.
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func main() {
	// Cria um "servidor de arquivos" para a pasta "static".
	fs := http.FileServer(http.Dir("./static"))
	// Envolvemos nossos handlers com o middleware de logging.
	http.Handle("/static/", loggingMiddleware(http.StripPrefix("/static/", fs)))
	http.Handle("/", loggingMiddleware(http.HandlerFunc(clockHandler)))
	http.Handle("/set-alarm", loggingMiddleware(http.HandlerFunc(setAlarmHandler)))

	fmt.Println("Servidor iniciado em http://localhost:8080")
	fmt.Println("Pressione CTRL+C para parar.")
	// Inicia o servidor na porta 8080. Se houver um erro, o programa termina.
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("ERRO CRÍTICO ao iniciar o servidor: %s\n", err)
	}
}
