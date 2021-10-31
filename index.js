const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'))

let data=[
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]




app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/info', (request, response) => {
    let data_size= data.length
        console.log(data_size)
    response.send(`<p>Phonebook has info for ${data_size}</p> <p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request, response) => {
    request_id=Number(request.params.id)
    person=data.find(person => person.id === request_id)
    console.log(request_id)
    if(person)
    response.json(person)
    else
        response.status(404).end()


})
app.delete('/api/persons/:id', (request, response) => {
    request_id=Number(request.params.id)
    data=data.filter(person=> person.id!== request_id)
    console.log(request_id)
    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const person= request.body
    if(!person.number || !person.name )
        return response.status(400).json({
            error: 'content missing'
        })
    console.log(data.filter(p => p.name === person.name))

    if( data.filter(p => p.name === person.name).length >=1) {
          return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    console.log(person)
    person.id=Math.floor(Math.random()*2000)
    data=data.concat(person)
    console.log(person)
    response.json(person)

})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

