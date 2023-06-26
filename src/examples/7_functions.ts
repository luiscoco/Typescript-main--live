{
	// = specifying a function type

	// ? type for any function?
	let fn;

	{
		/* javascript provides Function object that can be used as a type for functions, but: avoid the Function type, as it provides little safety for the following reasons:

		- It provides no type safety when calling the value, which means it's easy to provide wrong arguments.
		 */
		let fn: Function;
		fn = () => {};

		// - It accepts class declarations, which will fail when called, as they are called without the new keyword.
		fn = class {
			constructor(foo: string) {}
		};
		// fn(); // ! error at runtime: Class constructor cannot be invoked without 'new'
	}

	{
		// better solution:
		type AnyFunction = (...args: unknown[]) => unknown;
		// generic version
		type GenericFunction<T = unknown> = (...args: unknown[]) => T;

		let fn: AnyFunction;
		fn = class {
			constructor(foo: string) {}
		}; // error
		// fn();
	}

	// ? type for constructor?
	type AnyConstructor = new (...args: unknown[]) => unknown;
	// generic version
	type GenericConstructor<T = object> = new (...args: unknown[]) => T;

	let myConstructor: AnyConstructor = class {
		consructor(foo: string) {}
	};

	// ~ function type expression
	// (parameterName: parameterType) => returnValueType

	// ~ call signatures
	// ? how do we type a function that has a property on it


	}

{
	// = default parameters

	function applyDiscount(price: number, discount = 0.05): number {
		// number type is inferred for discount
		return price * (1 - discount);
	}

	console.log(applyDiscount(100)); // 95
}

{
	/*
	= optional arguments
	To make an argument optional, you need to use ?: for type annotation. it also adds |undefined to parameter type (if strictNullChecks are enabled)
	using union type with   |undefined  will still require this argument to be passed (though you can pass undefined in this case)
	*/
	function logPossiblyUndefinedFoo(foo: string | undefined) {
		console.log(foo);
	}
	logPossiblyUndefinedFoo(); // ! error, argument is required

	function logOptionalFoo(foo?: string) {
		console.log(foo);
	}
	logOptionalFoo();
}

{
	/*
	= rest arguments and tuples
	*/
	class X {
		constructor(foo: number, bar: number) {}

		static badCreate(...rest: number[]) {
			return new this(...rest); // ! A spread argument must either have a tuple type or be passed to a rest parameter.ts(2556)
			// with array type Typescript can'be sure that 2 required arguments will be passed for constructor
		}
		/* using tuple type, we enforce the check that there will be at least 2 arguments passed to create method,
		and that will satisfy the constructor function requirements */
		static goodCreate(...args: [number, number]) {
			return new this(...args);
			// with array type Typescript can'be sure that 2 required arguments will be passed for constructor
		}

		// ^ there is a in-built type for getting constructor parameters type: ConstructorParameters
		static create(...args: ConstructorParameters<typeof X>) {
			return new this(...args);
		}
	}

	const x = X.create(1, 2);

	class Y {
		constructor(foo: number, bar: number, ...rest: number[]) {}
		// if we have rest argument in constructor, we can add ... element in create method 'rest' tuple type
		static create(...args: [number, number, ...number[]]) {
			return new this(...args);
			// with array type Typescript can't be sure that 2 required arguments will be passed for constructor
		}
	}

	Y.create(1, 2);
}

{
	/*
	= options bag destructuring
	*/

	{
		// option bag pattern with destructuring used to set individual defaults for each option.
		function withOptionBag(foo: string, { bar: number = 0, baz } = {}) {} // ! baz has 'any' type (it has no default and its type cannot be inferred)

		// adding type annotation for option bag:
		type Options = {
			bar?: number;
			baz?: string;
		};

		function withTypedOptionBag(foo: string, { bar = 0, baz }: Options = {}) {} // * Ok, we added typing for option bag parameter.

		withTypedOptionBag('test'); // we can call function without second argument, since our option baf has a {} default specified

		withTypedOptionBag('test', {
			baz: 4, // * option bag properties are type-checked
		});
	}
}

/*
# readonly parameters
*/

interface User {
	name: string;
	id: number;
}

{
	// we can use Readonly built-in type and readonly modifier to prevent paramaeters mutation (is parameter is an object)
	function foo(
		user: Readonly<User>,
		users: ReadonlyArray<User>,
		users2: readonly User[] // same as ReadonlyArray<User>
	) {
		user.name = 'new name';
		users.push({
			name: 'new name',
			id: 1,
		});

		// but cannot forbid reassigning the value
		users = [];
	}
	// so it's a good idea to use eslint for that
	// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md
}

/*
# Overloads
*/
/*
the signature of the implementation is not visible 'from the outside'
When writing an overloaded function, you should always have two or more signatures above the implementation of the function.
implementation function isn’t callable; the function overload signatures are the ones that can be called.*/

// overload signatures:
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
// implementation:
function makeDate(monthOrTimestamp: number, day?: number, year?: number): Date {
	// type checks allow TS to differentiate between the overloads and understand what overload was actually used during the function call
	if (day !== undefined && year !== undefined) {
		return new Date(year, monthOrTimestamp, day);
	} else {
		return new Date(monthOrTimestamp);
	}
}

console.log(makeDate(12345678));
console.log(makeDate(5, 5, 5));

console.log(makeDate(1, 3)); // error, no overloads with 2 arguments exist


{
	// adding additional overload:
	function makeDate(datestring: string): Date;
	function makeDate(timestamp: number): Date;
	function makeDate(m: number, d: number, y: number): Date;
	// implementation:
	function makeDate(
		monthOrTimestampOrDatestring: number | string,
		day?: number,
		year?: number
	): Date {
		if (
			day !== undefined &&
			year !== undefined &&
			typeof monthOrTimestampOrDatestring === 'number'
		) {
			return new Date(year, monthOrTimestampOrDatestring, day);
		} else {
			return new Date(monthOrTimestampOrDatestring);
		}
	}

	console.log(makeDate(12345678));
	console.log(makeDate(5, 5, 5));
	console.log(makeDate('2023-10-15'));

	// console.log('DATE', Date.parse('2023-05-15'));
}


/*
If we want to allow our function to be called in yet different way (e.g. with 2 arguments or arguments of different types)
we need to define another overload that will reflect this case, and change implementation signature to incorporate it
then we need to adjust the logic inside the function (and probably add some type checks to avoid type errors)
*/

// console.log(makeDate(1, 3)); // ! error (no such overload that takes 2 arguments)


/* if you have 2 overloads with the same number of arguments and same function return type,
it's better to use non-overloaded function instead with union-type parameters  */

// # this value

{
	// ~ 'this' type can be inferred for common cases
	const user = {
		id: 123,
		admin: false,
		becomeAdmin() {
			this.admin = true;
		},
	};

	// ~ this is available as a type in class methods
	class Calculator {
		value = 0;

		add(value: number): this {
			this.value = this.value + value;
			return this;
		}

		subtract(value: number): this {
			this.value = this.value - value;
			return this;
		}
	}

	// ? how do we ensure that function will be called only in valid context (with correct `this` type?)
	{
		let identify;
		identify = function identify(message: string) {
			console.log(message + this.id); // `this` implicitly has `any` type
			// but we expect id property to be present on `this` value
		};

		const book = {
			name: 'Bestseller',
			identify: identify,
		};

		const product = {
			id: '123456',
			name: 'new product',
			identify: identify,
		};

		// if we try to call the function in a different context (with different `this` value) TS will throw an error
		book.identify('This book id is'); // there must be an error

		product.identify('Item id is:'); // should work

		identify.call(
			{
				id: '11',
			},
			'Hello'
		); // should work
	}

	// * SOLUTION
	{
		// ~ we can specify 'this' type that function will accept, as first parameter inside function type signature

		// by using `this` name for the first parameter, we activate `this`-type-checking feature of TS
		// (you should name the parameter `this`, it cannot be named `that` or something else)
		// first parameter this name `this` will only be used by Typescript and will be erased during compilation
		type Identifyable = {
			id: string;
		};

		function identify(this: Identifyable, message: string) {
			console.log(message + this.id);
		}

		identify.call(
			{
				id: '11',
			},
			'Hello'
		);

		// if we try to call the function in different context (with different this value) TS will throw an error

		const book = {
			name: 'Bestseller',
			identify: identify,
		};
		book.identify('This book id is');
	}
}
