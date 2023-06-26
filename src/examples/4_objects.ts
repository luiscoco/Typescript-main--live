// = as const assertion adds 'readonly' to all object keys

const pages = {
	home: '/',
	about: '/about',
	contacts: '/contacts',
} as const;

pages.about = '/new_about'; // ! error

{
	/*
	# Index signatures
	*/

	// ? if we don't know exactly in advance what properties our object will have, how can we configure its type?

	// 'object' type is not a very good choice, it's too wide
	{
		let obj: object;

		obj = [1, 2]; // we can assign array to object, not very useful
	}

	// = index signature syntax!
	// ^ The idea of the index signatures is to type objects of unknown structure when you only know the key and value types.
	{
		// collection that can have values of any type:
		type LooseObject = {
			[key: string]: unknown;
		};

		const newObj: LooseObject = {
			prop: 'foo',
			prop2: 12,
		};

		{
			// this object type will accept only numbers:
			type NumbersCollection = {
				[key: string]: number;
			};

			const obj: NumbersCollection = {
				one: 1,
			};

			// potential problem: we can access non-existing property
			const value = obj.two; // type if value is incorrectly inferred as number
			console.log(value.toFixed()); // will throw an error at runtime
		}
		{
			// solution: add 'undefined'
			type SafeNumbersCollection = {
				[key: string]: number | undefined;
			};

			const obj: SafeNumbersCollection = {
				one: 1,
			};

			const value = obj.two; // now value can be potentially undefined
			console.log(value.toFixed()); // !
		}

			}

	}

// # adding new props to existing object type
{
	{
		// = problem:
		const typedObject = {
			foo: 12,
			bar: 'bar-value',
		};

		typedObject.baz = 42; // ! baz doesn't exist in typedObject
	}

	// = SOLUTIONS
	{
		// ~ using 'any' type - not recommended
	}

	{
		// ~ using interface and optional props
		// declare baz in advance, but make it optional
		interface TypedObjectWithBaz {
			foo: number;
			bar: string;
			baz?: number;
		}
		// downside: we need additional interface and optional property

		// set the correct type for object when you create it
		const typedObject: TypedObjectWithBaz = {
			foo: 42,
			bar: 'foo',
		};

		typedObject.baz = 42;
	}

	{
		// ~ using loose index signature
		// this will allow to add any properties to this object
		interface LooseObject {
			[key: string]: unknown;
		}
		// downside: loose typing
		const looselyTypedObject: LooseObject = {
			foo: 42,
			bar: 'foo',
		};
		looselyTypedObject.baz = 42;
	}

	{
		// ~ immutable way: use destructuring/spread to create a new object with extended type
		// use spread operator
		const typedObject = {
			foo: 42,
			bar: 'foo',
		};

		const newObj = {
			...typedObject,
			baz: 12,
		};
	}
}
