/*
# TYPE ANNOTATIONS
TypeScript uses the syntax  : type    after an identifier as the type annotation, where type can be any valid type.

Once an identifier is annotated with a type, it can be used as that type only.
If the identifier is used as a different type, the TypeScript compiler will issue an error (see 'assignability').
*/
{
	let foo: number; // set the type annotation for variable. You won't be able to assign anything but number after this
}


/*
# ASSIGNABILITY
TypeScript performs assignability checks whenever a value is being assigned into another location in the computer’s memory, such as:
*/
// - Assigning values to variables.
{
	let foo: number;
	foo = 2;
	foo = 'foo-value'; // value type is not assignable to variable type
}
// - Passing arguments to functions.
{
	function logFoo(foo: number) {
		console.log(foo);
	}
	logFoo(2);
	logFoo('foo-value'); // value type is not assignable to argument type
}

{
	// = assignability check
	// values of more `narrow` types are assignable to values of wider types (narrower types are subsets of wider types)
	{
		const foo: 'bar' = 'bar'; // foo has a literal type `bar` (exact string value); literal string type is a subset of a wider `string` type
		const bar: string = foo; // * ok, 'foo' is assignable to wider type 'string'
	}
	// but we cannot assign a wider type to more narrow type
	{
		const foo: string = 'bar'; // `foo` is a `string`. TS loses the information about the exact string value, because we assign the general `string` type
		const bar: 'bar' = foo; //  not assignable, even though the actual value matches the literal `bar` type.
	}
}

// # PRIMITIVE TYPES

{
	// = number
	const foo: number = 0; // wide `number` type - any nymber
	const ten: 10 = 10; // number literal type - the exact number

	let five: 5;
	five = 10; // not assignable
}
{
	// = string
	const baz: string = 'baz'; // wide `string` type - any string
	const a: 'a' = 'a'; // string literal type - the exact string

	// template literal types
	const hexColor: `#${string}` = '#000fff';
}
{
	// = boolean
	const bool: boolean = true; // wide `boolean` type - true or false
	const tru: true = true; //  boolean literal type - exactly true or false;
}
{
	// = bigint
	const bigNumber: bigint = 100000n;
}
{
	// = symbol
	const symb: symbol = Symbol('new');
}
{
	// = null
	const nullable: null = null;
}
{
	// = undefined
	const undef: undefined = undefined;
}

/*
# TYPE INFERENCE AND AS CONST ASSERTION

Types can be automatically inferred
So often there is no need to explicitly specify a type
e.g if you assign a literal to a variable, you can omit type annotation (unless you want to safeguard against incrorrect assignment)
Variable type will be auto-calculated and set to specific value
*/
{
	// = inference examples
	const foo = true; // variable: foo is inferred to be of type 'true'
	const result = () => 'foo'; // function: return value is inferred to be of string type
}

{
	// = type widening and as const assertion
	// for `const` declaration, if type annotation is absent, literal type is inferred, type is not widened

	const inferredConst = 'foo'; // will be of type 'foo'

	let inferredLet = ''; // type is widened to 'string'
	inferredLet = 'baz'; // * OK, we can assign any string literal to string type

	let inferredLetAsConst = 'bar' as const; // 'as const' type assertion prevents type widening
	inferredLetAsConst = 'baz'; // ! error, we can't assign 'baz' to 'bar'

	// the same principle also applies to other primitive types
	let bool = true as const;
	bool = false; // ! error
}

// # NON-PRIMITIVE TYPES
{
	// = Array
	// array types are be written like this `number[]` or this `Array<number>`
	const arr = [1, 2, 3]; // by default array type is inferred as wide array type number[] (it can have any number of elements of type `number`)
	const arr2 = [1, 2, 3] as const; // specific type [1, 2 ,3] ('as const' allows us to narrow the type of array like with literals)

	}
{
	/*
	= Tuple
	An array with specified number of elements and their respective types (order matters here)
	*/
	let vectorCoordinate: [number, number, number] = [1, 4, 6];
	vectorCoordinate = [1, 2, 4, 5]; // ! error - wrong number of elements

	let productPrice: [string, number];
	productPrice = ['apples', 1000];
	productPrice = [1000, 'apples']; //! error - wrong order

		}

{
	/*
	= Object
	see more details in objects.ts file
 	*/
	{
		// when using literal syntax, object type is inferred as a literal type (exact object shape with all properties)
		const object = {
			foo: 1,
			bar: 'bar',
		};

		// we can use more general object type but it is too wide type, that will match almost everything, e.g array too
		let obj: object;

		obj = {
			foo: 1,
			bar: 'bar',
		};

		obj = [1, 2];
	}

	{
		/*
		~ objects assignability
		When comparing object types, TypeScript will ensure that all the required fields exist in the assigning object type.
		It will also ensure that all fields that do exist on the types match up

		objects are compared structurally (by their shape)
		*/

		function receiveSkeleton(skeleton: { spooky: boolean; scary: boolean }) {
			console.log(skeleton.spooky ? 'Spooky ' : 'Not spooky...');
			console.log(skeleton.scary ? 'scary!' : 'Not scary...');
		}

		receiveSkeleton({ spooky: true, scary: false }); // * Ok

		receiveSkeleton({
			spooky: 'Very!', // ! Error: Type 'string' is not assignable to type 'boolean'
			scary: true,
		});
	}
}

{
	/*
	= Function
	see more details in functions.ts file
	*/
	{
		// function type is written as function signature - a combination of parameters types and return type
		// (parameterName: parameterType) => returnValueType
		let greetingFn: (name: string) => string;

		greetingFn = function (name: string): string {
			return `Hi ${name}`;
		};
		// specifying return type after : is optional, return type can be automatically inferred depending on what is actually returned

		greetingFn = function (name: string) {
			console.log('Hello');
		};
		// ! error, 'greeting' type annotation indicates, that function must return a string value
	}
}

// # SPECIAL TYPES

/* sometimes you don't know the type of variable, that you e.g. receive from user input or external API, or javascript files */
{
	/*
	= any
	essentially disables type checks for this value (any value is assignable to 'any')
	Avoid using any unless you really need an unsafe escape hatch. Use unknown instead
	*/
	let anything: any;
	// let anything; // any type is also inferred if no type is specified

	anything = 'string value';

	anything = {
		foo: 'foo',
	};

	// some methods return 'any'
	const json = `{"latitude": 10.11, "longitude": 12.12}`;
	const currentLocation = JSON.parse(json); // returns 'any' type
	console.log(currentLocation);

	console.log(currentLocation.x); // * OK no complaints from ts
	}

{
	/*
	= unknown

	`unknown` is the set of all possible values.

	This means that `unknown` is a supertype of every other type.
	Everything is assignable to unknown, but we cannot use it in a meaningful way unless we run a type check
	Use `unknown` where there will be a value, but it might have any type
	*/

	const unknownVar: unknown = 'anything';
	unknownVar.toUppercase();

	{
		// using any
		const x: any = {
			foo: 'foo-value',
			bar: 'bar-value',
		};

		const baz = x.baz; // * OK...
	}

	{
		// using unknown
		const x: unknown = {
			foo: 'foo-value',
			bar: 'bar-value',
		};

		const baz = x.baz; // ! can't do this;

		// first we need to ensure the property really exists...
		if (typeof x === 'object' && x !== null && 'baz' in x) {
			const baz = x.baz; // now we can access the property
		}
	}

	{
		const x: unknown = 42;

		const result = Math.pow(x, 2); // ! unknown is not assignable to number

		// we need to narrow the type...
		if (typeof x === 'number') {
			// ^ inside `if` block `x` type is inferred as `number`, because it has successfully passed the `typeof` condition check
			const result = Math.pow(x, 2); // * OK
		}
	}
}

{
	/*
	= void
	only undefined and never are assignable to void.
	if a function does not return any value then you can specify void as return type.
	 */
	
	
	{
		/*
		^ when a literal function definition has a void return type, that function must not return anything.
		*/
		function log(arg: unknown): void {
			// console.log(arg);
			return true;
		}
	}

	{
		let fn: () => void;

		fn = function () {
			return true;
		};

		let result = fn();
	}

	// a function that does not return a value, actually returns undefined,
	// but we don't care about this value (not going to use it use it), that's why we can set the type to void
}

{
	/*
	= never
	never can not have any value (nothing is assignable to it)
	never is assignable to anything
	never type is used to indicate the value that will never occur
	Use never in positions where there will not or should not be a value.
	*/

	function generateError(message: string): never {
		throw new Error('message');
	}

	
	// function eternalLoop(): never {
	// 	while (true) {
	// 		console.log('I never return')
	// 	}
	// }

	}
