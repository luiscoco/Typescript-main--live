// ~ conditional types
{
	/*
  syntax looks like ternary expression in Javascript:
  SomeType extends OtherType ? TrueType : FalseType;

  Resulting type depends on whether SomeType is assignable to OtherType or not
  */

	type FoobarObject = {
		foo: string;
		bar: number;
	};

	type FooIsAString = FoobarObject['foo'] extends string ? true : false;

	
	// flatten example
	{
		type Flatten1<T> = T extends Array<unknown> ? T[0] : T;
		// T[0] is a way to get the type of array element using indexed access
		// so we 'drill down' one level (from array type to its element's type). If element is not an array, we just return the type
		// this allows us to flatten the array

		// This imlememntation will flatten just 1 level

		// Extracts out the element type.
		type FlattenedArr1 = Flatten1<string[]>; // string
		type FlattenedArr2 = Flatten1<string[][]>; // string[]
		// Leaves the type alone.
		type FlattenedNum = Flatten1<number>;

		const nestedArray: number[][] = [[1], [2, 3]];
		const flatArray: Flatten1<number[][]> = nestedArray.flat(2);
	}

	// recursive flatten
	// ? a type that will flatten any number of nesting levels?
	{
		// flatten any number of nesting levels
		type Flatten<T> = T extends Array<unknown> ? Flatten<T[0]> : T;
		
		// we apply Flatten recursively to we can go any number of levels down to extract the type of element
		type ElementType1 = Flatten<string[][][]>;
		type ElementType2 = Flatten<string[][]>;
		type ElementType3 = Flatten<number>;
	}

	
	// ~ infer
	{
		// in condition extend clause, we can use `infer Item` in place of `any` to alias array element type as Item variable.
		// then we can use this variable diectly in 'true' branch instead of retrieving T from array with T[0]

		type Flatten<T> = T extends Array<infer Item> ? Flatten<Item> : T;
		/* This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in */

	}
}

// = mapped types
{
	// index signature syntax:
	type LooseObject = {
		[key: string]: unknown;
	};

	// `in` operator, used in index signature syntax, iterates over union type, so as a result we get an object shape with properties, taken from union
	// we 'map' union type to new 'Mapped' type
	type Mapped = {
		[value in 'foo' | 'bar']: boolean;
	};
	
	// This union type we can obtain from another existing object type, using `keyof` operator to get all keys of this object
	{
		type FoobarObject = {
			foo: string;
			bar: number;
		};

		type FoobarObjectKeys = keyof FoobarObject;
		// assert<FoobarObjectKeys extends 'foo' | 'bar' ? true : false>(true);

		type Mapped = {
			[Value in keyof FoobarObject]: boolean;
		};
	}

	// we can make a generic type, that will map keys of some object type in a certain way
	{
		type FoobarObject = {
			foo: string;
			bar: number;
		};
		// make all keys boolean
		type WithBooleanKeys<T> = {
			[Key in keyof T]: boolean;
		};

		type FoobarObjectWithBooleanKeys = WithBooleanKeys<FoobarObject>;
	}

	// ~ mapping modifiers
	/*   There are two additional modifiers which can be applied during mapping: readonly and ? which affect mutability and optionality respectively.
  You can remove or add these modifiers by prefixing with - or +. If you don’t add a prefix, then + is assumed. */
	{
		type FoobarObject = {
			foo: string;
			bar: number;
		};

		// ~readonly modifier
		type MakeImmutable<T> = {
			readonly [Key in keyof T]: T[Key];
			// Key can be used to get the original type of the field, using indexed access
			// then we just add readonly to this type
		};

		type ImmutableFoobarObject = MakeImmutable<FoobarObject>;
		// ^ there is a built-in type that does that: Readonly
		type ImmutableFoobarObject2 = Readonly<FoobarObject>;

		// removing readonly
		type MakeMutable<T> = {
			-readonly [Key in keyof T]: T[Key];
			// Key can be used to get the original type of the field, using indexed access
			// the n we just ass readonly to this type
		};

		type MutableFoobarObject = MakeMutable<ImmutableFoobarObject>;

		// ~optional modifier
		type WithOptionalKeys<T> = {
			[Key in keyof T]?: T[Key];
		};

		type FoobarObjectWithOptionalKeys = WithOptionalKeys<FoobarObject>;
		// ^ there is a built-in type that does that: Partial
		type FoobarObjectWithOptionalKeys2 = Partial<FoobarObject>;

		type WithRequiredKeys<T> = {
			[Key in keyof T]-?: T[Key];
		};

		type FoobarObjectWithRequiredKeys =
			WithRequiredKeys<FoobarObjectWithOptionalKeys>;
	}

}
