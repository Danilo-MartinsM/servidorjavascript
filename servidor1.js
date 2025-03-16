//Importação dos módulos fs e path:
//fs é usado para ler arquivos do sistema de arquivos.
//path é usado para manipular caminhos de arquivos.
const http = require('http');
const fs = require('fs');
const path = require ('path');

const server = http.createServer((req, res) => {
//Verificação do método HTTP:
// Se o método for GET, o servidor serve arquivos como antes.
    if (req.method === 'GET') {
//Definição do caminho do arquivo:
// filePath é construído usando path.join() para garantir que o caminho seja correto, independentemente do sistema operacional.
// Se a URL for /, o servidor serve index.html.
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        let extname = path.extname(filePath);
        let contentType = 'text/html';
// Definição do tipo de conteúdo:
// O tipo de conteúdo é definido com base na extensão do arquivo.
        switch (extname){
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
        }
//Leitura do arquivo:
//fs.readFile() lê o arquivo. Se o arquivo não for encontrado, o servidor serve uma página 404 personalizada.
//Se ocorrer outro erro, o servidor retorna um erro 500.
        fs.readFile(filePath, (err, content) => {
            if (err){
                if (err.code == 'ENOENT'){
                    fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.end(content, 'utf-8');
                });
                } else {
                    res.writeHead(500);
                    res.end(`Erro do servidor: ${err.code}`);
                }
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content, 'utf-8');
            }
        });
//Verificação do método HTTP:
// Se o método for POST, o servidor coleta os dados enviados no corpo da requisição.
    } else if (req.method === 'POST') {
        let body = '';
//Coleta de dados POST:
// req.on('data', chunk => { ... }) coleta os dados enviados no corpo da requisição.
// req.on('end', () => { ... }) é chamado quando todos os dados foram recebidos.
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
//Resposta para POST:
// O servidor responde com uma mensagem JSON indicando que os dados foram recebidos com sucesso.
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: 'Dados recebidos com sucesso!', data: body}));
        });
    } else {
//Método não permitido:
// Se o método HTTP não for GET ou POST, o servidor retorna um erro 405 (Método Não Permitido).
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Método não permitido');
    }
});
// Iniciar o servidor:
// O servidor escuta na porta definida pela variável de ambiente PORT ou na porta 3000.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta`+ {PORT}));
