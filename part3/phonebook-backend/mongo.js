const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://MarkMan0:${password}@cluster0.j15yx1c.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  // create new Person
  const name = process.argv[3], number = process.argv[4]
  console.log('creating', name, number)
  new Person({ name, number })
    .save()
    .then(result => {
      mongoose.connection.close()
    })
} else {
  console.log('phonebook:')
  Person.find({}).then(results => {
    results.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
