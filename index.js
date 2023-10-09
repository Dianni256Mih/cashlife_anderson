const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.listen(600, ()=> console.log("Pandinha"));

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

// Rotas para a tabela 'usuario'

app.get('/usuario/', async (req, res) => {
    const resultado = await getAllPessoas()

    if (resultado.length === 0) {
        return res.status(200).json({ mensagem: 'Nenhum usuário encontrado no database!' });
    }
    return res.status(200).json(resultado);
});

app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'usuario não encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuario' });
    }
});

app.get('/usuario/buscarnome/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE nome LIKE ?', [`%${nome}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma usuario encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuarios por nome' });
    }
});

app.get('/usuario/buscaremail/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM usuario WHERE email LIKE ?', [`%${email}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma usuario encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar usuarios por email' });
    }
});


app.post('/usuario', async (req, res) => {
    const { nome, email } = req.body;
    try {
        const [query] = await connection.execute('INSERT INTO usuario (nome, email) VALUES (?, ?)', [nome, email]);
        res.status(201).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar usuario' });
    }
});

app.put('/usuario/:id', async (req, res) => { 
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const [query] = await connection.execute('UPDATE usuario SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuario' });
    }
});

app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM usuario WHERE id = ?', [id]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar usuario' });
    }
});

// app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));

// Rotas para a tabela 'categoria_receita'

//  Operação para salvar uma Categoria Receita
app.post('/categoriaReceita', async (req, res) => {
    const { nome } = req.body;
    try {
        const [result] = await connection.execute('INSERT INTO categoria_receita (nome) VALUES (?)', [nome]);
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar CategoriaReceita' });
    }
});

// Operação para obter uma Categoria Receita por ID
app.get('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita' });
    }
});

// Operação para obter uma categoria receita
app.get('/categoriaReceita/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita');
        if (query.length === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita' });
    }
});

// Operação para buscar Categoria Receita por nome
app.get('/categoriaReceita/buscar/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_receita WHERE nome LIKE ?', [`%${nome}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma CategoriaReceita encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar CategoriaReceita por nome' });
    }
});

// Operação para apagar uma Categoria Receita por ID
app.delete('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM categoria_receita WHERE id = ?', [id]);
        if (query.affectedRows === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json({ mensagem: 'CategoriaReceita apagada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao apagar CategoriaReceita' });
    }
});

// Operação para atualizar uma Categoria Receita por ID
app.put('/categoriaReceita/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const [query] = await connection.execute('UPDATE categoria_receita SET nome = ? WHERE id = ?', [nome, id]);
        if (query.affectedRows === 0) return res.status(404).json({ mensagem: 'CategoriaReceita não encontrada' });
        res.status(200).json({ mensagem: 'CategoriaReceita atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar CategoriaReceita' });
    }
});

//app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));

// Rotas para a tabela 'categoria_despesa'

// Rota para salvar uma nova categoria de despesa
app.post('/categoria_despesa', async (req, res) => {
    const { nome, tipo, usuario_id } = req.body;
    try {
        const [result] = await connection.execute('INSERT INTO categoria_despesa (nome, tipo, usuario_id) VALUES (?, ?, ?)', [nome, tipo, usuario_id]);
        const newCategoryId = result.insertId;
        res.status(201).json({ id: newCategoryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar categoria de despesa' });
    }
});

// Rota para obter uma categoria de despesa por ID
app.get('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar categoria de despesa' });
    }
});

// Operação para obter uma categoria despesa
app.get('/categoria_despesa/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Categoria_despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar Categoria_despesa' });
    }
});

// Rota para buscar categorias de despesa por nome
app.get('/categoria_despesa/buscar/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM categoria_despesa WHERE nome LIKE ?', [`%${nome}%`]);
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar categorias de despesa por nome' });
    }
});

// Rota para apagar uma categoria de despesa por ID
app.delete('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.execute('DELETE FROM categoria_despesa WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json({ mensagem: 'Categoria de despesa apagada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao apagar categoria de despesa' });
    }
});

// Rota para atualizar uma categoria de despesa por ID
app.put('/categoria_despesa/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, usuario_id } = req.body;
    try {
        const [result] = await connection.execute('UPDATE categoria_despesa SET nome = ?, tipo = ?, usuario_id = ? WHERE id = ?', [nome, tipo, usuario_id, id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Categoria de despesa não encontrada' });
        res.status(200).json({ mensagem: 'Categoria de despesa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar categoria de despesa' });
    }
});

//app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));

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

// Operação para salvar uma despesa
app.post('/despesas', async (req, res) => {
    const { descricao, valor, data, categoriaDespesaId } = req.body;
    try {
        const [result] = await connection.execute(
            'INSERT INTO despesas (descricao, valor, data, categoria_despesa_id) VALUES (?, ?, ?, ?)',
            [descricao, valor, data, categoriaDespesaId]
        );
        res.status(201).json({ mensagem: 'Despesa criada com sucesso', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar despesa' });
    }
});

// Operação para obter uma despesa por ID
app.get('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesa' });
    }
});

// Operação para obter uma despesa
app.get('/despesas/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM despesas');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesa' });
    }
});

// Operação para buscar despesas por descrição
app.get('/despesas/buscar/:descricao', async (req, res) => {
    const { descricao } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE descricao LIKE ?', [`%${descricao}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por descrição' });
    }
});

// Operação para buscar despesas por categoria
app.get('/despesas/buscarPorCategoria/:categoriaId', async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE categoria_despesa_id = ?', [categoriaId]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada para esta categoria' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por categoria' });
    }
});

// Operação para buscar despesas por data
app.get('/despesas/buscarPorData/:dataInicio/:dataFim', async (req, res) => {
    const { dataInicio, dataFim } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM despesas WHERE data >= ? AND data <= ?', [dataInicio, dataFim]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma despesa encontrada para este período' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar despesas por data' });
    }
});

// Operação para atualizar uma despesa por ID
app.put('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoriaDespesaId } = req.body;
    try {
        const [query] = await connection.execute(
            'UPDATE despesas SET descricao = ?, valor = ?, data = ?, categoria_despesa_id = ? WHERE id = ?',
            [descricao, valor, data, categoriaDespesaId, id]
        );
        res.status(200).json({ mensagem: 'Despesa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar despesa' });
    }
});

// Operação para apagar uma despesa por ID
app.delete('/despesas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM despesas WHERE id = ?', [id]);
        res.status(200).json({ mensagem: 'Despesa deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar despesa' });
    }
});

//app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));

// Rotas para a tabela 'receitas'

// Operação para salvar uma receita
app.post('/receitas', async (req, res) => {
    const { descricao, valor, data, categoriaReceitaId } = req.body;
    try {
        const [result] = await connection.execute(
            'INSERT INTO receitas (descricao, valor, data, categoria_receita_id) VALUES (?, ?, ?, ?)',
            [descricao, valor, data, categoriaReceitaId]
        );
        res.status(201).json({ mensagem: 'Receita criada com sucesso', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao criar receita' });
    }
});

// Operação para obter uma receita por ID
app.get('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE id = ?', [id]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Receita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receita' });
    }
});

// Operação para obter uma receita por ID
app.get('/receitas/', async (req, res) => {
    try {
        const [query] = await connection.execute('SELECT * FROM receitas');
        if (query.length === 0) return res.status(404).json({ mensagem: 'Receita não encontrada' });
        res.status(200).json(query[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receita' });
    }
});

// Operação para buscar receitas por descrição
app.get('/receitas/buscar/:descricao', async (req, res) => {
    const { descricao } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE descricao LIKE ?', [`%${descricao}%`]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por descrição' });
    }
});

// Operação para buscar receitas por categoria
app.get('/receitas/buscarPorCategoria/:categoriaId', async (req, res) => {
    const { categoriaId } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE categoria_receita_id = ?', [categoriaId]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada para esta categoria' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por categoria' });
    }
});

// Operação para buscar receitas por data
app.get('/receitas/buscarPorData/:dataInicio/:dataFim', async (req, res) => {
    const { dataInicio, dataFim } = req.params;
    try {
        const [query] = await connection.execute('SELECT * FROM receitas WHERE data >= ? AND data <= ?', [dataInicio, dataFim]);
        if (query.length === 0) return res.status(404).json({ mensagem: 'Nenhuma receita encontrada para este período' });
        res.status(200).json(query);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao buscar receitas por data' });
    }
});

// Operação para atualizar uma receita por ID
app.put('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoriaReceitaId } = req.body;
    try {
        const [query] = await connection.execute(
            'UPDATE receitas SET descricao = ?, valor = ?, data = ?, categoria_receita_id = ? WHERE id = ?',
            [descricao, valor, data, categoriaReceitaId, id]
        );
        res.status(200).json({ mensagem: 'Receita atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao atualizar receita' });
    }
});

// Operação para apagar uma receita por ID
app.delete('/receitas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [query] = await connection.execute('DELETE FROM receitas WHERE id = ?', [id]);
        res.status(200).json({ mensagem: 'Receita deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao deletar receita' });
    }
});

//app.listen(porta, () => console.log(`Servidor está rodando na porta ${porta}`));
