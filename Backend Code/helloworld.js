var User = /** @class */ (function () {
    function User(nameRef) {
        this.name = nameRef;
    }
    return User;
}());
var user = new User("test");
console.log(user.name);
