// create an interface that defines a shape of Product and types of its properties

function getProduct(id: number): {
	id: number;
	name: string;
	price: number;
} {
	// set the function's return type
	return {
		id: id,
		name: `Awesome Gadget ${id}`,
		price: 99.5,
	};
}

// ~ EXAMPLE 1 - property referencing non-existing property (or wrongly named)
function example1() {
	const product = getProduct(1);
	console.log(`The product ${product.Name} costs ${product.price}`); // We see an error in editor immediately and even a suggestion about the correct property name
}
example1();

// ~ EXAMPLE 2 - passing arguments in a wrong order
function example2() {
	const showProduct = (name: string, price: number) => {
		// set types for function parameters
		console.log(`The product ${name} costs ${price}$.`);
	};

	const product = getProduct(1);
	showProduct(product.price, product.name); // Error about the incorrect value type
}
example2();
