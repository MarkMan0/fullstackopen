const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://MarkMan0:${password}@cluster0.j15yx1c.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(results => {
  results.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
