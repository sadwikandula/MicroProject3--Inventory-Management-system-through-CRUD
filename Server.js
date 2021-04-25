const express = require('express')
const app=express()
const bodyparser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true},(err, database) => {
    if (err) return console.log(err)
    db = database.db('Inventory')
    app.listen(5000, () => {
        console.log('Listening at port number 5000')
    })
})


app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(express.static('public'))

//Home Page

app.get('/',(req, res) => {
    db.collection('Stock').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('homepage.ejs',{data: result})
    })
})

app.get('/create', (req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock', (req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct', (req,res)=>{
    res.render('delete.ejs')
})


app.post('/AddData',(req, res) => {
    db.collection('Stock').save(req.body, (err, result) => {
        if (err) return console.log(err)
    res.redirect('/')
    })
})

app.post('/update',(req, res) => {
    db.collection('Stock').find().toArray( (err, result) => {
        if (err) return console.log(err)
    for(var i=0; i<result.length;i++)
    {
        if(req.body.product_id == result[i].product_id)
        {
            s=result[i].quantity           
             break
        }
        
    }
    db.collection('Stock').findOneAndUpdate({product_id: req.body.product_id},{
       $set: {quantity: parseInt(s) + parseInt(req.body.quantity)}}, {sort: {_id: -1}} 
       , (err, result) => {
           if (err)
            return res.send(err)
        console.log(req.body.product_id+' stock updated')
        
       

        })

    })
    res.redirect('/')
})

app.post('/delete', (req,res) =>{
    db.collection('Stock').findOneAndDelete({product_id:req.body.product_id}, (err,result)=>{
        if (err)
            return console.log(err)
        res.redirect('/')

    })
})
