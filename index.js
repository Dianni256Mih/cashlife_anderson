const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.listen(3000, ()=> console.log("Pandinha"));

const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'mydb',
    user: 'root',
    password: ''
});

const getAllPessoas = async () =>{
    const [query] = await conection.execute('select * from usuario')
    return query
}

app.get('/pessoa',async (req,res)=>{
    const resultado = await getAllPessoas()
    if (resultado.length === 0){
      return res.status(200).json({ mensagem: "Nenhum usuário encontrado no database!" });
}
    return res.status(200).json(resultado)
})

app.get('/pessoa/:id', async (req,res)=>{
    const {id} = req.params;
    const [query] = await conection.execute('select * from usuario where id = ?', [id]);
    if (query.length===0) return res.status(400).json({mensagem: 'nenhuma pessoa foi encontrada'});
    return res.status(200).json(query)
})

app.get('/pessoa/buscarnome/:nome', async (req,res)=>{
    const {nome} = req.params;
    const [query] = await conection.execute('select * from usuario where nome like ?', ['%'+nome+'%']);
    if (query.length===0) return res.status(400).json({mensagem: 'nenhuma pessoa foi encontrada'});
    return res.status(200).json(query)
})

app.get('/pessoa/buscaremail/:email', async (req,res)=>{
    const {email} = req.params;
    const [query] = await conection.execute('select * from usuario where email like ?', ['%'+email+'%']);
    if (query.length===0) return res.status(400).json({mensagem: 'nenhuma pessoa foi encontrada'});
    return res.status(200).json(query)
})

app.post('/pessoa', async (req,res)=>{
    const {nome, email} = req.body;
    const [query] = await conection.execute('insert into usuario (nome, email) values (?, ?)',[nome, email]);
    return res.json(query);
})
app.put('/pessoa/:id', async (req,res)=>{
    const {id} = req.params;
    const {nome, email} = req.body;
    const [query] = await conection
    .execute('update usuario set nome = ?, email = ? where id = ?',[nome, email, id]);
    return res.json(query);
})

app.delete('/pessoa/:id', async(req,res) =>{
    const {id} = req.params
    const [query] = await conection.execute('delete from usuario where id = ?', [id])
    return res.json(query)
})

// Rotas para a tabela 'usuario'

app.get('/usuario', async (req, res) => {
    const [rows] = await connection.execute('select * from usuario');
    res.json(rows);
});

app.post('/usuario', async (req, res) => {
    const { nome, email, senha, cpf } = req.body;
    const [result] = await connection.execute('insert into usuario (nome, email, senha, cpf) VALUES (?, ?, ?, ?)', [nome, email, senha, cpf]);
    res.json(result);
});


// Rotas para a tabela 'categoria_receita'

app.get('/categoria_receita', async (req, res) => {
    const [rows] = await connection.execute('select * from categoria_receita');
    res.json(rows);
});

app.post('/categoria_receita', async (req, res) => {
    const {descricao, valor, data } = req.body;
    const [result] = await connection.execute('insert into categoria_receita ({descricao, valor, data) VALUES (?, ?, ?, ?)', [descricao, valor, data]);
    res.json(result);
});

// Rotas para a tabela 'categoria_despesa'

app.get('/categoria_despesa', async (req, res) => {
    const [rows] = await connection.execute('select * from categoria_despesa');
    res.json(rows);
});

app.post('/categoria_despesa', async (req, res) => {
    const { nome, tipo, usuario_id, usuario_cpf } = req.body;
    const [result] = await connection.execute('insert into categoria_despesa (nome, tipo, usuario_id, usuario_cpf) VALUES (?, ?, ?, ?)', [nome, tipo, usuario_id, usuario_cpf]);
    res.json(result);
});

// Rotas para a tabela 'receitas'

app.get('/receitas', async (req, res) => {
    const [rows] = await connection.execute('select * from receitas');
    res.json(rows);
});

app.post('/receitas', async (req, res) => {
    const { descricao, valor, data, categoria_receita_usuario_id, categoria_receita_usuario_cpf, categoria_receita_id } = req.body;
    const [result] = await connection.execute('insert into receitas (descricao, valor, data, categoria_receita_usuario_id, categoria_receita_usuario_cpf, categoria_receita_id) VALUES (?, ?, ?, ?, ?, ?)', [descricao, valor, data, categoria_receita_usuario_id, categoria_receita_usuario_cpf, categoria_receita_id]);
    res.json(result);
});

// Rotas para a tabela 'despesas'

app.get('/despesas', async (req, res) => {
    const [rows] = await connection.execute('select * from despesas');
    res.json(rows);
});

app.post('/despesas', async (req, res) => {
    const { descricao, valor, data, categoria_despesa_id, categoria_despesa_usuario_id, categoria_despesa_usuario_cpf } = req.body;
    const [result] = await connection.execute('insert into despesas (descricao, valor, data, categoria_despesa_id, categoria_despesa_usuario_id, categoria_despesa_usuario_cpf) VALUES (?, ?, ?, ?, ?, ?)', [descricao, valor, data, categoria_despesa_id, categoria_despesa_usuario_id, categoria_despesa_usuario_cpf]);
    res.json(result);
});

