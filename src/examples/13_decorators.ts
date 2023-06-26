// ^ To enable support for decorators, you must enable the experimentalDecorators compiler option in your tsconfig.json


/*
 A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter.
 Decorators use the form @expression,
 where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.
 */

{
	@classDecorator
	class Rocket {
		color!: string;

		constructor(@constructorParameterDecorator private pilot: string) {}

		@propertyDecorator
		name = 'SuperHeavy';

		@methodDecorator
		launch(@parameterDecorator time: number) {
			console.log('Launching rocket in 3... 2... 1... 🚀');
		}

		@staticPropertyDecorator
		static type = 'Starship';

		@staticMethodDecorator
		static test(@staticParameterDecorator time: number) {}
	}

	/* Rocket decorators */
	// ~ class decorator
	function classDecorator(target: typeof Rocket) {
		console.log(target);
		// do something with your class
		return class RocketWithFuel extends target {
			fuel = 100;
		};
	}

	
	// ~ parameter decorator
	function parameterDecorator(
		target: typeof Rocket.prototype,
		propertyKey: keyof Rocket,
		parameterIndex: number
	): void {
		console.log(target);
		console.log(propertyKey);
		console.log(parameterIndex);
		// do something with your parameter
	}

	// ~ method decorator
	// accessor decorators work the same way
	function methodDecorator(
		target: typeof Rocket.prototype,
		propertyKey: keyof Rocket,
		descriptor: PropertyDescriptor
	) {
		console.log(target);
		console.log(propertyKey);
		console.log(descriptor);
		// do something with your method
	}

	
	// ~ property decorator
	function propertyDecorator(
		target: typeof Rocket.prototype,
		propertyKey: string
	): void {
		console.log(target);
		console.log(propertyKey);
		// do something with your property
	}

	// ~ static parameter decorator
	function staticParameterDecorator(
		target: typeof Rocket,
		propertyKey: keyof typeof Rocket,
		parameterIndex: number
	): void {
		console.log(target);
		console.log(propertyKey);
		console.log(parameterIndex);
		// do something with your static parameter
	}

	// ~ static method decorator
	// accessor decorators work the same way
	function staticMethodDecorator(
		target: typeof Rocket,
		propertyKey: keyof typeof Rocket,
		descriptor: PropertyDescriptor
	) {
		console.log(target);
		console.log(propertyKey);
		console.log(descriptor);
		// do something with your static method
	}

	// ~ static property decorator
	function staticPropertyDecorator(
		target: typeof Rocket,
		propertyKey: keyof typeof Rocket
	): void {
		console.log(target);
		console.log(propertyKey);
		// do something with your static property
	}

	// ~ constructor parameter decorator
	function constructorParameterDecorator(
		target: typeof Rocket,
		propertyKey: undefined,
		parameterIndex: number
	) {
		console.log(target);
		console.log(propertyKey);
		console.log(parameterIndex);
		// do something with your parameter
	}
}

// ~ Decorator factory pattern
/* Decorator factory is a function that returns a decorator.
This enables you to customize the behavior of your decorators by passing some parameters in the factory.
So instead of adding the decorator itself to the target like @decorator,
you add a call to decoratorFactory function, thta will return a decorator, like @decoratorFactory()
you pass some arguments to this call and change the behavior of returned decorator based on these arguments
*/

{
	class Greeter {
				@enumerable(true)
		@addMessage('World')
		greet() {
			return 'Hello';
		}
	}

	function addMessage(message: string) {
		return function (
			target: typeof Greeter.prototype,
			propertyKey: keyof Greeter,
			descriptor: PropertyDescriptor
		) {
			const result = descriptor.value();
			descriptor.value = () => {
				return `${result} ${message}`;
			};
		};
	}

	function enumerable(value: boolean) {
		return function (
			target: typeof Greeter.prototype,
			propertyKey: keyof Greeter,
			descriptor: PropertyDescriptor
		) {
			descriptor.enumerable = value;
		};
	}

	const greeter = new Greeter();
	console.log(greeter.greet());

	for (const key in greeter) {
		console.log(key);
	}
}


function SetColorDecorator(constructor: typeof Car) {
	console.log('first class decorator');
	return class Ret extends Car {
		constructor() {
			super();
			this.color = 'red';
		}
	};
}

@SetColorDecorator
class Car {
	public isFixed: boolean;
	public color!: 'red' | 'blue';
	constructor() {
		console.log('calling class constructor');
		this.isFixed = true;
	}
}

const car = new Car();

console.log({
	isFixed: car.isFixed,
	color: car.color,
});

