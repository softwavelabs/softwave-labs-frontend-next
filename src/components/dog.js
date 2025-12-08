var Person = /** @class */ (function () {
    function Person(name, surname, age, id) {
        var _this = this;
        this.getName = function () {
            return _this.name;
        };
        this.getSurname = function () {
            return _this.surname;
        };
        this.getAge = function () {
            return _this.age;
        };
        this.getId = function () {
            return _this.id;
        };
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.id = id;
    }
    return Person;
}());
var person = new Person('Antek', 'Balagan', 27, 123456789);
var l = [3, 2, 4, 7, 9, 1, 2, 4, 6];
var n = l.map(function (num) { return num * 2; });
var c = l.reduce(function (acc, num) { return acc + num; }, 0);
var x = [1, 2, 7];
var y = x.reduce(function (sum, num) { return sum + num; }, 10);
var w = l.filter(function (n) { return n == 4; }).length;
var even = x.filter(function (n) { return n % 2; });
x.forEach(function (n) {
    console.log(n);
});
for (var i = 0; i++; i < 10) {
    console.log('* ');
}
// console.log(even)
// console.log(w)
// console.log(l)
// console.log(n)
// console.log(c)
// console.log(y)
