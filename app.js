const  express = require("express");
//const pg = require('pg');
const path = require("path");


const {Client } = require('pg');
const client = new Client({
user: 'postgres',
password: 'password',
host: 'localhost',
port: 5432,
database: 'iceCreamShop',
})


client.connect();




const app = express();
const port = 4444;
app.use(express.json());

app.use(express.static("./public"))



app.get('/', (req, res) => {
  res.sendFile((path.resolve(__dirname, "./home.html")));
})
app.get('/flavors', (req, res) => {
  res.sendFile((path.resolve(__dirname, "./flavors.html")));
})

app.get('/getAllFlavors', async (req, res) =>{
  const data = await client.query('SELECT * FROM flavor ORDER BY flavor_id');
  res.json(data.rows);
})

app.get('/api/staff', async (req, res) => {
  console.log("Running Route")
  const data = await client.query('SELECT * FROM person');
  res.json(data.rows);
})

app.post('/iceCreamAdd', async (req, res) => {
  
  const { name, favorite, color } = req.body;

  console.log(req.body)

  await client.query('INSERT INTO flavor (flavor_name, is_favorite, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)', [name, favorite]);
  res.json('success');
})

app.delete('/flavorDelete/:ident', async (req, res) =>{
  let { ident } = req.params;
  console.log(ident)
  let slicedIdent = ident.slice(1);

 let newIdent = async ()=>parseInt(slicedIdent); 

 let sqlIdent =  await newIdent();
   
  console.log(typeof sqlIdent)
  await client.query(`DELETE FROM flavor WHERE flavor_id = $1`,  [sqlIdent]);
  res.json('success');
})

// app.put('/flavorSetFavorite', async (req, res) =>{

//   const { favorite, id } = req.body;   

// console.log(req.body) 
  
//   await client.query(`UPDATE flavor SET updated_at = CURRENT_TIMESTAMP,  is_favorite = $1 WHERE flavor_id = $2`,  [favorite, id ]);
//   res.json('success');
// })


app.put('/flavorSetFavorite/:favorite/:id', async (req, res) =>{

  const { favorite, id } = req.params;   
  
  await client.query(`UPDATE flavor SET updated_at = CURRENT_TIMESTAMP,  is_favorite = $1 WHERE flavor_id = $2`,  [favorite, id ]);
  res.json('success');
})

app.get('/checkout', (req, res) => {
  res.sendFile((path.resolve(__dirname, "./checkout.html")));
})

  
 
  
 
   
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });