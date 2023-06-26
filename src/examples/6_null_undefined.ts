{
	/* behavior of null and undefined checks are influenced by strictNullChecks option in tsconfig
  without this option, Typescript does not complain, if you try to access properties in object that is potentially null or undefined
  */

	// ~ foo is possibly null
	{
		function logFoo(foo: string | null) {
			console.log(foo.toUpperCase()); // ! error, foo is possibly null
		}
	}

	// ~ foo is possibly undefined
	// ^ undefined is added to parameters type in this case
	{
		function logFoo(foo?: string) {
			console.log(foo.toUpperCase()); // ! error, foo is possibly undefined
		}

		logFoo();
	}

	// ^ so we're forced to run a type check to ensure that the parameter is not undefined before running methods on it
	{
		function logFoo(foo?: string) {
			if (foo) {
				console.log(foo.toUpperCase()); // * OK
			}
		}
		logFoo();
	}
}

{
	// # Non-null assertion operator !
	// In fact, non-nullish (non-null and non-undefined)
	// = Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:
	{
		type FooType = number | null; // e.g. some external type that we import from external library, that has null in it

		function logFoo(foo: FooType) {
			// console.log(foo.toFixed(2)); // ! error, foo is potentially undefined

			console.log(foo!.toFixed(2)); // * no error - we use ! assertion, knowing that in reality foo will never be null
		}
		logFoo(2);
	}

	{
		const myElement = document.querySelector('.myClass');
		// querySelector method return Element | null type  (because it can not guarantee that the element will be found)

		console.log(myElement.innerHTML); // ! error, myElement can be null
		// if we are sure, we can use non-null assertion
		console.log(myElement!.innerHTML); // * OK
	}
}
