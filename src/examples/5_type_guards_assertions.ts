// # Narrowing and type guards

/*
Typescript analyzes possible paths of code execution and how they affect variable type and makes conclusion about the type.
Expressions that TS can use to make conclusions about possible types (to 'narrow' the type) are called type guards
*/

{
	// = if (truthiness)
	function getUsersOnlineMessage(numUsersOnline: number | null) {
		if (numUsersOnline) {
			return `There are ${numUsersOnline} online now!`;
		}
		return "Nobody's here. :(";
	}
}

{
	// = switch
	interface Circle {
		kind: 'circle';
		radius: number;
	}

	interface Square {
		kind: 'square';
		sideLength: number;
	}

	type Shape = Circle | Square;

	function getArea(shape: Shape) {
		switch (shape.kind) {
			case 'circle':
				return Math.PI * shape.radius! ** 2;
			case 'square':
				return shape.sideLength ** 2;
		}
		// we can also use if / else
		/* if (shape.kind === 'circle') {
			return Math.PI * shape.radius! ** 2;
		} else {
      return shape.sideLength ** 2;
    } */
	}
}

{
	// = typeof
	const formatPrice = (price: number | string) => {
		// "price" is of a "number | string" type
		if (typeof price === 'string') {
			// "price" is of a "string" type
			return parseInt(price, 10).toFixed(2);
		}
		// "price" is of a "number" type
		return price.toFixed(2);
	};
}

{
	// = instanceof
	function logValue(x: Date | string) {
		if (x instanceof Date) {
			console.log(x.toUTCString());
		} else {
			console.log(x.toUpperCase());
		}
	}
}

{
	// = in
	type Fish = { swim: () => void };
	type Bird = { fly: () => void };

	function move(animal: Fish | Bird) {
		if ('swim' in animal) {
			return animal.swim();
		}

		return animal.fly();
	}
}

{
	// = custom type guards (using type predicate syntax as return type)
	type Fish = {
		swim: () => void;
	};

	type Bird = {
		fly: () => void;
	};

	type Pet = Fish | Bird;

	function playWithPet(pet: Pet) {
		pet.swim(); // ! can't use this method without narrowing the Pet to Fish type

		if (isFish(pet)) pet.swim();
		else pet.fly();
	}

	const fish: Pet = {
		swim() {},
	};
	fish.swim();

	playWithPet(fish);

	function isFish(pet: Pet): pet is Fish {
		return (pet as Fish).swim !== undefined;
	}

	// example of object type guard
	function isObject(value: unknown): value is object {
		return typeof value === 'object' || value !== null;
	}
}

{
	/*
	#  Type assertions
	Sometimes you will have information about the type of a value that TypeScript can’t know about and it can narrow the type without our help.
	we can forcefully narrow the type, using type assertion, if we are SURE
	*/

	// const myCanvas = document.querySelector('#main_canvas');

	// querySelector returns general Element type, but if this case we know that we'll get HTMLCanvasElement (which is a subtype of HTMLElement)
	const myCanvas = document.querySelector('#main_canvas') as HTMLCanvasElement;

	// ^ TypeScript only allows type assertions which convert to a more specific or less specific version of a type (a wider type to its subtype)
	const foo = 'hello' as number; // ! error

	// but we can make those too, using double assertions via unknown
	const bar = 'hello' as unknown as number;
}

// = satisfies
{
	// can be used to check the type without widening it (that can cause loss ot type information)
	// object

	type Config = {
		type: string;
		name: string;
		color: string | number;
	};

	{
		const cfg = {
			type: 'car',
			color: 'red',
		};
		// cfg is a literal object type that holds information that color is a string
		// I can use string methods on it
		console.log(cfg.color.toUpperCase());
		// ! problem: I missed some required fields from config
	}

	{
		/* I need my cfg to be typed-check as Config so that I won't miss any required fields  */
		// now I get error about missing key
		const cfg: Config = {
			type: 'car',
			color: 'red',
		};

		// ! problem: now I am not able to use cfg.color as string, because in Config it has union type
		console.log(cfg.color.toUpperCase());
		// and have to run type-check, though I already know that it is actually a string
		if (typeof cfg.color === 'string') console.log(cfg.color.toUpperCase());
		// This happened because TS widened the literal object type to be Config (assigned a new Config type to cfg)
	}
	{
		// using `satisfies`, I can type-check cfg and get an error about the missing key
		const cfg = {
			// type: 'car',
			name: 'Cristina',
			color: 'red',
		} satisfies Config;

		// but now I'm still able to call string method, because I preserved the literal type information that color is actually a string
		// TS will not widen a type in this case
		console.log(cfg.color.toUpperCase());

		type HEX = `#${string}`;
		const black = '#000fff' satisfies HEX;
	}
}
