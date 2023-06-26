/*
# Interface

Interfaces are used to describe a “shape” of an object by specifying a certain set of properties and their types.
*/
{
	interface Config {
		foo: string;
		bar: number;
	}

	// properties are checked to correspond the interface shape
	const cfg: Config = {
		foo: 'foo-value',
		bar: 0,
	};
}

{
	/*
	= optional ? modifier
	*/

	interface Config {
		foo: string;
		bar: number | undefined; // still required, but can be undefined
		baz?: number; // optional    number | undefined
		// quux?: number | undefined; // (same as above, | undefined is automatically added (if strictNullChecks option is tsconfig.json is on))
	}

	let wrongConfig: Config = {
		// ! required 'bar' property is missing
		foo: 'foo!',
	};

	let configWithOptionalValue: Config = {
		foo: 'foo!',
		bar: undefined,
		baz: undefined, // is valid with or without with line
	};
}

{
	//= interfaces can also specify methods
	interface Person {
		firstName: string;
		lastName: string;
		age: number;

		sayHi: () => void;
	}

	{
		const john: Person = {
			// ! error: required sayHi method, specified in Person interface, is missing
			firstName: 'John',
			lastName: 'Doe',
			age: 46,
		};
	}

	{
		const john: Person = {
			// * ok
			firstName: 'John',
			lastName: 'Doe',
			age: 46,

			sayHi() {
				console.log('Hello');
			},
		};
	}
}

{
	// = readonly modifier
	interface Config {
		readonly foo: string;
		bar: number;
	}

	
	const cfg: Config = {
		foo: 'foo-value',
		bar: 0,
	};

	cfg.foo = 'new value'; // ! cannot change readonly property
	cfg.bar = 1; // * ok
}

{
	// = extending interfaces
	// interfaces can be extended
	// interface can extend several other interfaces
	// ^ interfaces support extending, unlike type aliases

	interface Person {
		firstName: string;
		lastName: string;
		age: number;
	}

	interface Citizen {
		passportId: string;
	}

	interface Employee extends Person, Citizen {
		salary: number;
	}

	const worker: Employee = {
		firstName: 'John',
		lastName: 'Doe',
		age: 25,
		salary: 2000,
		passportId: '123456789',
	};
}

{
	// = interfaces declaration merging (if several interfaces with the same name are declared)
	interface Song {
		artistName: string;
	}

	interface Song {
		songName: string;
	}

	const song: Song = {
		artistName: 'Freddie',
		songName: 'The Chain',
	};
}

{
	/*
  # Type aliases
  Type aliases allow you to create a new name for an existing type.
  */

	type User = {
		name: string;
		password: string;
	};
	// here we create an alias of literal object type

	// we could also use an interface to achieve a similar result:
	/* interface User {
		name: string;
		password: string;
	} */

	type AnyFunction = (...args: unknown[]) => unknown; // type alias for function type

	// ^ type aliases are especially useful, because they allow to create union and intersection types
	// (with interfaces we cannot achieve union type behavior)

	type AvailableCountries = 'Poland' | 'Romania' | 'Ukraine';
	const country: AvailableCountries = 'Ukraine';
	// see union & intersection types example
}
