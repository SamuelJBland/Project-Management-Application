class User {
    name: string;
    constructor(nameRef: string) {
        this.name = nameRef;
    }
}


let user = new User("test");

console.log(user.name);
