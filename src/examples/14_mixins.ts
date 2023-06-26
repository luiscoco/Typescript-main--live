// # mixins
// mixin pattern can be used to build classes by combining simpler partial classes.
// it is an alternative to traditional OOP hierarchy, where you are limited to extending one class

// = the class we want to add functionality to - our base class
class Sprite {
	x = 0;
	y = 0;
}

// = some utility types we will need:

// non-generic constructor
type Constructor = new (...args: any[]) => {};

// generic constructor
type GConstructor<T = {}> = new (...args: any[]) => T;

// ~ simple mixin (can be used with any base class)

{
	// Mixin is a factory function which returns a class expression, extending the base class.
	function ScalableMixin<T extends Constructor>(Base: T) {
		// we can use anonymous class like `return class Scalable extends Base`, but it's better to add a name for debugging purposes
		return class Scalable extends Base {
			scale = 1;
		};
	}

	// Now we can compose a new class from the Sprite class
	const ScalableSprite = ScalableMixin(Sprite);
	const ScalableSprite2 = ScalableMixin(Date); // mixin accepts any class because we used non-generic Constructor

	const scalableSprite = new ScalableSprite();
	console.log(scalableSprite.x);
	console.log(scalableSprite.scale);

	// ~ getting mixin type

	// we can use this helper type to get the type, returned by mixin
	// can be useful if we need to construct the 'mixed' type to use it in type-checks
		type AnyFunction<T = any> = (...input: any[]) => T;
	type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;

	// use intersection of base class and mixin type to type-check that mixin is applied
	const scalableSprite2: Sprite & Mixin<typeof ScalableMixin> =
		new ScalableSprite();
}

// ~ it may be better to declare an interface that mixin should implement, and use this inteкface for type-checks
{
	interface Scalable {
		scale: number;
		setScale: () => void;
	}

	function ScalableMixin<T extends Constructor>(Base: T) {
		// we can use anonymous class like `return class Scalable extends Base`, but it's better to add a name for debugging purposes
		return class ScalableMixin extends Base implements Scalable {
			scale = 1;
			setScale() {}
		};
	}

	const ScalableSprite = ScalableMixin(Sprite);
	// in this way we get more readable type on our scalableSprite variable
	const scalableSprite: Sprite & Scalable = new ScalableSprite();
}

// ~ constrained mixins
{
		// If we use generic Constructor type, we are able to pass a type to it, limiting the mixin usage to the constructor of type
	// this mixin will be applicable only to class that returns Sprite instance, i.e Sprite class

	// if we rely on having specific properties our base class, we can pass a literal type as constraint instead
	function ScalableMixin<T extends GConstructor<Sprite>>(Base: T) {
		return class Scalable extends Base {
			scale = 1;
		};
	}

	const ScalableSprite = ScalableMixin(Sprite);
	const ScalableSprite2 = ScalableMixin(Date);
}


// ~ multiple mixins composition
{
	function ScalableMixin<T extends GConstructor<Sprite>>(Base: T) {
		return class Scalable extends Base {
			scale = 1;
		};
	}

	function PositionableMixin<T extends GConstructor<Sprite>>(Base: T) {
		return class Positionable extends Base {
			position = 0;
		};
	}

	const ComposedSprite = PositionableMixin(ScalableMixin(Sprite));

	type AnyFunction<T = any> = (...input: any[]) => T;
	type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;

	const composedSprite: Sprite &
		Mixin<typeof ScalableMixin> &
		Mixin<typeof PositionableMixin> = new ComposedSprite();
}


// ~ combined example
{
	type Constructor<T = {}> = new (...args: any[]) => T;

	class Foo {
		foo = 'foo';
	}

	interface WithBar {
		bar: string;
		logFoo: () => void;
	}

	function BarMixin<
		T extends Constructor<{
			foo: string;
		}>
	>(Base: T) {
		// we can use anonymous class like `return class Scalable extends Base`, but it's better to add a name for debugging purposes
		return class BarMixin extends Base implements WithBar {
			bar = 'bar';

			logFoo() {
				console.log(this.foo);
			}
		};
	}

	interface WithBaz {
		baz: string;
		logBar: () => void;
	}

	function BazMixin<
		T extends Constructor<{
			bar: string;
		}>
	>(Base: T) {
		return class BazMixin extends Base implements WithBaz {
			baz = 'baz';

			logBar() {
				console.log(this.bar);
			}
		};
	}

	const ComposedFromFoo = BazMixin(BarMixin(Foo));

	const composed: Foo & WithBar & WithBaz = new ComposedFromFoo();
}
