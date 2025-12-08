class Person {
    public name: string;
    public surname: string;
    protected readonly age: number;
    private id: number;

    constructor(name, surname, age, id) {
        this.name = name
        this.surname = surname
        this.age = age
        this.id = id
    }

    getName = () => {
        return this.name;
    };
    getSurname =  () => {
        return this.surname;
   };
    getAge = () => {
        return this.age;
    };

    getId = () => {
      return this.id;
    };
}


const person = new Person('Antek', 'Balagan', 27, 123456789);
const l = [3,2,4,7,9,1,2,4,6]
const n = l.map(num => num * 2)
const c = l.reduce((acc, num) => acc + num, 0);
const x = [1,2,7]
const y = x.reduce((sum, num) => sum + num, 10);
const w = l.filter(n => n == 4).length;
const even = x.filter(n => n % 2 );
x.forEach(n => {
   console.log(n)
});

for(let i = 0; i++; i < 10) {
    console.log('* ')
}

// console.log(even)
// console.log(w)
// console.log(l)
// console.log(n)
// console.log(c)
// console.log(y)

