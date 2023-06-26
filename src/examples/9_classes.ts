class Point {
	x = 0; // if field is initialized, type is automatically inferred
	y: number = 0; // works same as above; no need to specify the type unless you want to be explicit about it
}

// = Constructor
{
	class Point {
		x: number;
		y: number;

		// Normal signature with defaults
		constructor(x: number, y = 0) {
			this.x = x;
			this.y = y;
		}

		// ^ Constructors can’t have return type annotations - the class instance type is always what’s returned
		
			}
}

// = strict property initialization
{
	class Foo {
		// Typescript cannot be sure that we will assign this property later and it won't be undefined:
		fullName: string; // ! Property 'fullName' has no initializer and is not definitely assigned in the constructor

		fullnameSetInCtor: string; // * Good, initialized in constructor

		// but we are sure that it will done (in init method) so we can use definite assignment assertion assertion
		fullnameSetInInit!: string; // ~ OK, definite assignment assertion used

		constructor(private name: string, private surname: string) {
			this.fullnameSetInCtor = `${name} ${surname}`;
			// this.fullName2 = `${name} ${surname}`;
			this.init();
		}

		// TypeScript does not analyze methods you invoke from the constructor to detect initializations,
		// because a derived class might override those methods and fail to initialize the members
		init() {
			this.fullName = `${this.name} ${this.surname}`;
			this.fullnameSetInInit = `${this.name} ${this.surname}`;
		}
	}

	const john = new Foo('John', 'Doe');

	// ^ strictPropertyInitialization:false in tsconfig.ts can prevent such errors from showing up
}

// # property modifiers
{
	// = visibility modifiers
	class Params {
		// ~ public property; properties are public by default if no visibility modifier is applied
		public foo = 0;
		bar = 0; // same as above (also public)

		// ~ protected
		protected baz = 0;
		
		// ~ private
		// typescript private (soft-private)
		private quux = 0;
		
		// js-private (hard-private) - ES standard, will remain private in runtime
		#truePrivate = 0;
	}

	const params = new Params();
	console.log(params.foo); // *
	console.log(params.bar); // *
	console.log(params.baz); // !
	console.log(params['baz']); // *  brackets syntax is used as escape hatch to access protected and soft-private members if you need them e.g. for tests
	console.log(params.quux); // !
	console.log(params['quux']); // *

	// console.log(params.#truePrivate); // ! this will produce an error in runtime
	{
		// = readonly
		type ResourceType = 'Text' | 'Picture' | 'Video';

		class Resource {
			readonly type: ResourceType = 'Text';

			constructor(type: ResourceType) {
				// we can change readonly property inside constructor
				this.type = type;
			}

			setType(type: ResourceType) {
				// we cannot change it from outside
				this.type = type; // ! can't change in methods
			}
		}

		const text = new Resource('Text');
		text.type = 'Video'; // ! can't change outside the class
	}

	// = parameter modifiers
	{
		class Params {
			#truePrivate: number;

			constructor(
				public foo: number,
				readonly bar: number,
				protected baz: number,
				private quux: number,
				truePrivate: number
			) {
				// can't do the same for hard-private field, we have to assign it in constructor
				this.#truePrivate = truePrivate;
			}
		}

		const params = new Params(1, 2, 3, 4, 5);
		console.log(params.foo);
		console.log(params.bar);
	}

	
	{
		// # static members
		// static methods and properties also can use public, protected, and private modifiers
		// = static property modifiers
		class MyClass {
			private static foo = 0;
			static readonly bar = 'A';
			static #truePrivate = 1;
		}
		console.log(MyClass.foo); // ! foo is private

		MyClass.bar = 'B'; // ! bar is readonly

		// MyClass.#truePrivate; // ! hard-private - this will produce an error in runtime

			}
}


// # full class example
{
	class User {
		private _age?: number;
		// in fact, a common constructor function, used to create an object
		// it is called automatically on new User() call
		constructor(public name: string, private surname: string) {}

		/* CLASS FIELDS */
		counter = 0;

		// method can also be assigned as a class field, it will also be individual
		// increaseCounter = () => {
		// 	console.log(this);
		// 	this.counter++;
		// };

		/* PROTOTYPE METHODS */
		// all methods, declared within a class, are written into the object prototype
		increaseCounter() {
			console.log(this);
			this.counter++;
		}

		sayHi() {
			console.log(`Hello, ${this.name}`);
		}

		get age() {
			return this._age;
		}

		set age(age) {
			this._age = age;
		}

		getFullname() {
			return `${this.name} ${this.surname}`;
		}
	}
}

// # Inheritance
{
	// = inheritance example
	{
		class Animal {
			constructor(public name: string) {}

			eaten = 0;

			eat(amount: number) {
				this.eaten += amount;
				console.log(`${this.name} has already eaten: ${this.eaten}`);
			}
		}

		class Cat extends Animal {
			meow() {
				console.log(`${this.name}: meow!`);
			}

			
			// ~ override keyword
			/* When a method is marked with override, TypeScript will always make sure that a method with the same name exists in a the base class.
			So if you'll try to remove the method with the same name in the base class, TS will complain and require you to change the associated method in child class
			you need to enable  "noImplicitOverride": true   in tsconfig.json (false by default) */
			override eat(amount: number) {
				super.eat(amount); // call parent method
				this.meow(); // do something additionally
			}

			// duplicate identifier error
					}

		const cat = new Cat('Garfield');
		cat.eat(12);
	}

	// = abstract classes
	{
		/* An abstract method or abstract field is one that hasn’t had an implementation provided.
		These members must exist inside an abstract class, which cannot be directly instantiated.

		The role of abstract classes is to serve as a base class for subclasses which do implement all the abstract members.
		When a class doesn’t have any abstract members, it is said to be 'concrete'.*/

		abstract class Base {
			abstract getName(): string;

			printName() {
				console.log('Hello, ' + this.getName());
			}
		}

		const b = new Base(); // ! Cannot create an instance of an abstract class.

		// derived class needs to implement all the members of the abstract class, that are marked as abstract
		class Derived extends Base {
			getName() {
				return 'world';
			}
		}
		const d = new Derived();
		d.printName();
	}
}


// # Interfaces implementation
{
	/*
	Interface serves as a 'contract' between the classes that implement this interface and the external code, that uses this interface
	Interface defines the syntax for classes to follow.
	Classes that are derived from an interface must follow the structure provided by their interface.
	*/

	{
		interface Pingable {
			ping(): void;
		}

		class Sonar implements Pingable {
			// * OK
			ping() {
				console.log('ping!');
			}
		}

		class Ball implements Pingable {
			ping(): void {
				throw new Error('Method not implemented.');
			}
			// ! ping method is not implemented
			pong() {
				console.log('pong!');
			}
		}
	}
	// ~ class can implement multiple interfaces
	{
		interface Pingable {
			ping(): void;
		}

		interface Pongable {
			pong(): void;
		}

		class PingPong implements Pingable, Pongable {
			ping() {
				console.log('ping');
			}

			pong() {
				console.log('pong');
			}
		}
	}

	// = merging of interface and class declarations
	{
		// You have interfaces in your code that you use as data models, but you want to be able to construct these models as objects and be able to add functionality to them.
		// Normally, you would create a new Class and implement the wanted model interface by fulfilling the properties manually.
		// But if the implemented interface changes later on, you will have to update all the class implementations manually.

		interface Foo {
			bar: string;
		}

		class Foo {
			baz = 42;
			// bar: string;

			constructor() {
				this.bar = 'bar-value'; // * OK, as if bar was declared on the class itself
			}

			log() {
				console.log(this.baz);
			}
		}
	}

	}


// # this
{
	{
		// setting type to 'this' is not the same as setting it to class name
		// 'this' refers dynamically(!) to the class
		class Box {
			content: string = '';

			set(value: string) {
				// return type is inferred as 'this', not 'Box'
				this.content = value;
				return this;
			}
		}

		class ClearableBox extends Box {
			clear() {
				this.content = '';
			}
		}

		const box = new Box();
		const boxThis = box.set('value');

		const clearableBox = new ClearableBox();
		const clearableBoxThis = clearableBox.set('hello'); // will be a ClearableBox now (that is correct) and not a parent Box because set returns this
	}

	}
