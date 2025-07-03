const printInformation = ({ name, age }: { name: string; age: number }) => {
  console.log(`Hello ${name}, ${age} years old`)
}

const Lee = { name: 'Duy Lee', age: 20 }
const { name, age } = Lee
printInformation({ name, age })
