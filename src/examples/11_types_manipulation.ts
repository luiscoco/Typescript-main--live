// = typeof type operator
{
	// javascript typeof operator: we use it in Javascript expressions (expression context)
	console.log(typeof 'Hello world');

	// TypeScript typeof operator: is used in a type context to refer to the type of a variable or property:
	let s = 'hello';

	const x = ' hello';
	// colon opens type context (expression after the colon is type expression that exists only in TS, and typescript-specific operators can be used there)
	let n: typeof s; // type of n will be 'string'
	let w: typeof x; // type of n will be 'hello'

	// ^ Remember that values and types aren’t the same thing. To refer to the type that the value fn has, we use typeof:
	{
		// this is a js expression context:
		function fn() {
			return { x: 10, y: 3 };
		}

		// this is a type context, so we cannot just use  'fn' here, we need to retrieve fn type using the typeof operator
		type Wrong = ReturnType<fn>; // ! 'fn' refers to a value, but is being used as a type here. Did you mean 'typeof fn'?
		type Correct = ReturnType<typeof fn>;
	}

	{
		class Thing {
			foo = 1;
			static bar = 'ABC';
		}

		const thing = new Thing();

		{
			// 'Thing' type refers to the instance of the class
			// to get the type of the class itself, we need to use `typeof Thing`

			// our factory function takes a class as an argument and produces an instance of this class
			function factory(Class: typeof Thing): Thing {
				console.log(Thing.bar);
				return new Class();
			}
			console.log(factory(Thing));
		}

		// ? how to create a generic factory function that will take any class as an argument?
		{
			type Constructor<T> = { new (...args: unknown[]): T };

			function create<T>(Class: Constructor<T>): T {
				return new Class();
			}

			const thingInstance = create(Thing);
		}

	}
}

// = keyof operator
{
	// The keyof operator takes an object type and produces a string or numeric literal union of its keys.
	type Point = { foo: number; bar: number };

	type PointKey = keyof Point; // same as 'foo' | 'bar

	const coordinate: PointKey = 'bar';

	}
// = indexed access
{
	type Person = { age: number; name: string; alive: boolean };
	type Age = Person['age']; // number
	type AgeOrName = Person['age' | 'name']; // string | number

	}
