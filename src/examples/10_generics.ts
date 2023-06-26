// We need generics to make our strictly typed code reusable

// # identity function example

// the identity function is a function that will return back whatever is passed in
{
	function identity(arg: number): number {
		return arg;
	}

	const result = identity(12);

	function identityLoose(arg: unknown): unknown {
		return arg;
	}

	// result type will be unknown, we lose typing (even though we know the argument type (whether we pass string of number) and know that result type will be excatly the same)
	const result2 = identityLoose('my string');
	const result3 = identityLoose(12);
}

// to make it work not only with numbers,
// we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned.
// Here, we will use a type variable, a special kind of variable that works on types rather than values.
// <T> clause is a type parameter, similar to function parameters, but works with types
{
	function identity<T>(arg: T): T {
		return arg;
	}

	// omitting type argument - it will be auto-inferred from 'arg' argument type
	let output2 = identity(123);
	let output3 = identity('my str');
	let output4 = identity([0, 1, 2]);

	// explicitly passing type argument - may be needed if type argument inference fails
	let output = identity<string>('myString');
}

{
	function loggingIdentity<T>(arg: T): T {
		console.log(arg.length); // ! error T is not guaranteed to have a length property
		return arg;
	}

	function loggingIdentity2<T>(arg: T[]): T[] {
		console.log(arg.length); // * OK
		// now arg is guaranteed to have .length since it's an array
		// Type parameter can still be just `T` cause it doesn't have to be the same as arg parameter type
		return arg;
	}

	const result = loggingIdentity2([1, 2, 3]);
	// result has type number - knowing that arg type is T[] (array of T's), and value passed is [1,2,3],
	// Typescript is able to calculate that T in this case is number
}

// # Constraints
{
	{
		interface HasLength {
			length: number;
		}

		// another way to solve the problem above: set constraints for Type
		function loggingIdentity<T extends HasLength>(arg: T): T {
			console.log(arg.length); // * OK
			return arg;
		}

		// now loggingIdentity will accept everything that has .length property
		const result = loggingIdentity([1, 2, 3]);
		const result2 = loggingIdentity('some string');

		const result3 = loggingIdentity(12); // !
	}

	{
		function longest<T extends { length: number }>(a: T, b: T) {
			if (a.length >= b.length) {
				return a;
			} else {
				return b;
			}
		}
		// longerArray is of type 'number[]'

		// using 2 different types, each constrained by length
		interface HasLength {
			length: number;
		}

		function longest2<T1 extends HasLength, T2 extends HasLength>(
			a: T1,
			b: T2
		) {
			if (a.length >= b.length) {
				return a;
			} else {
				return b;
			}
		}

		const longerArray = longest2([1, 2], 'bob');

		// longerString is of type 'alice' | 'bob'
		const longerString = longest('alice', 'bob');

		const notOK = longest(10, 100); // ! Error - Numbers don't have a 'length' property
	}
}

/*
= Error: 'T' could be instantiated with a different subtype of constraint ...
 */
{
	function minimumLength<T extends { length: number }>(
		obj: T,
		minimum: number
	): T {
		if (obj.length >= minimum) {
			return obj;
		} else {
			// return { length: minimum }; // !

			/*
      !Type '{ length: number; }' is not assignable to type 'Type'.
      !'{ length: number; }' is assignable to the constraint of type 'Type',
      !but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'
			 */

			const newObj = {
				...obj,
				addedProp: 12,
			};

			// we can return a wider type then original;
			// return newObj;

			const { length, ...rest } = obj;
			// we cannot return object without length prop
			// return rest;

			return { ...rest, length: minimum } as T;
		}
	}

	minimumLength(
		{
			name: 'Joe',
			description: 'desc',
			length: 12,
		},
		2
	);

}

// # generic interfaces
{
	interface Foo {
		bar: <T>(arg: T) => T; // only bar function is generic
		baz: string;
	}

	const foo: Foo = {
		bar: <T>(arg: T): T => arg,
		baz: 'baz',
	};

	// we may want to move the generic parameter to be a parameter of the whole interface.
	// this makes the type parameter visible to all the other members of the interface.
	interface Quux<T> {
		// now the whole interface is generic and all members can refer to T type
		bar: (arg: T) => T;
		baz: T;
	}

	// now we need to pass the exact type argument to the generic interface, when implementing it
	const quux: Quux<string> = {
		bar: (arg) => arg,
		baz: 'baz',
	};

	const quux2: Quux<number> = {
		bar: (arg) => arg,
		baz: 'baz', // ! error, baz should be a number, because we passed number as type argument for Quux interface, so T becomes a number and 'baz' has type T
	};

	{
		// if you set the default for type argument, you will be able to use the interface with default type without specifying it each time
		interface Quux<T = string> {
			// now the whole interface is generic and all members can refer to T type
			bar: (arg: T) => T;
			baz: T;
		}

		const quux: Quux = {
			bar: (arg) => arg,
			baz: 'baz',
		};

		const quux2: Quux<number> = {
			bar: (arg) => arg,
			baz: 12,
		};
	}
}


// # generic classes
{
	class Quux<T> {
		constructor(public baz: T) {}

		bar<K extends T>(arg: K): K {
			return arg;
		}

		static prop: T;
		// class has two sides to its type: the static side and the instance side.
		// ^ Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class’s type parameter.
	}

	const quux = new Quux<number>(123); // since <number> is passed as T value, TS makes sure that baz argument is a number, can't pass string
	const quux2 = new Quux<number>('str');
	const quux3 = new Quux('str'); // T will be inferred as string based on actual type of the passed argument argument

	quux.bar('str'); // ! bar argument should also be number because we created Quux<number> instance
	quux.bar(42);
}

// # generic type aliases

// = non-generic:
{
	type AtLeast2Numbers = [number, number, ...number[]];

	const twoNumbers: AtLeast2Numbers = [0, 1]; // *ok
	const threeNumbers: AtLeast2Numbers = [0, 1, 2]; // *ok
	const oneNumber: AtLeast2Numbers = [0]; // ! not enough

	// second element should be a string
	type AtLeast2Mixed = [number, string, ...number[]];
	const mixed: AtLeast2Mixed = [12, '']; // *ok
	const mixed2: AtLeast2Mixed = ['', 12]; // ! wrong order of types
}

// = generic versions:
{
	// now to make it generic:
	// ~ single-type
	type AtLeast2<T> = [T, T, ...T[]];

	const twoNumbers: AtLeast2<number> = [0, 1]; // *ok
	const twoNumbers2: AtLeast2<number> = ['a', 'b']; // ! incorrect elements type
	const twoStrings: AtLeast2<string> = ['a', 'b']; // *ok

	// ~ mixed
	type AtLeast2Mixed<T, K> = [T, K, ...T[]];
	const mixed: AtLeast2Mixed<number, string> = [12, '']; // * OK
	const mixed2: AtLeast2Mixed<string, number> = ['', 12]; // *OK
}

// # generic arrays
{
	// arrays are already generic
	// another way of writing number[] is Array<number>
	const numbersArray: Array<number> = [1, 2, 3];
	const numbersArray2: number[] = [1, 2, 3]; // same as above

	const stringsArray: Array<string> = ['foo', 'bar', 'baz'];

	const mixedArray: Array<string | number> = ['foo', 22, 'baz'];
}

// # Generic functions


// = Explicitly specifying type arguments
{
	function combine<T>(arr1: T[], arr2: T[]): T[] {
		return arr1.concat(arr2);
	}

	const arr = combine([1, 2, 3], ['hello']);

	// we manually specify the T here (pass a argument) because TS is not able to do this automatically
	const arr2 = combine<string | number>([1, 2, 3], ['hello']); // *

	function combineMixed<T, K>(arr1: T[], arr2: K[]): Array<T | K> {
		return { ...arr1, ...arr2 };
	}

	const arrMixed = combineMixed<number, string>([1, 2, 3], ['hello']);
}

