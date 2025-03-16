const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET') {
        if (pathname === '/') {
            fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Erro do servidor: ${err.code}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        } else if (pathname === '/sobre') {
            fs.readFile(path.join(__dirname, 'sobre.html'), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Erro do servidor: ${err.code}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        } else if (pathname.startsWith('/api/')) {
            const userId = pathname.split('/')[2];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Bem-vindo, usuário ${userId}!` }));
        } else {
            fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Erro do servidor: ${err.code}`);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Dados recebidos com sucesso!', data: body }));
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Método não permitido');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));