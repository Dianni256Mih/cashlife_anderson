const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.listen(3000,()=> console.log("Pandinha"));
// app.get('/',(req,res)=>{ res.send("Pode entrar.") })
// app.get('/gatinho/lindao',(req,res)=>{ res.send("miau") })
// app.get('/fim',(req,res)=>{ res.end() })
// const dados = ["Emily x"];
// app.get('/j',(req,res)=>{res.json({dados})})

const mysql = require('mysql2/promise');
const conection = mysql.createPool({
    host:'localhost',
    port:3306,
    database:'mydb',
    user:'root',
    password:''
})
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