// ~ EXAMPLE 1 - property referencing non-existing property (or wrongly named)

function getProduct(id) {
	return {
		id: id,
		name: `Awesome Gadget ${id}`,
		price: 99.5,
	};
}

function example1() {
	const product = getProduct(1);

	console.log(`The product ${product.Name} costs ${product.price}`); // The product undefined costs $99.5
	// we received no hints from the editor and no errors during the execution, but we get a wrong message
}
example1();

// ~ EXAMPLE 2 - passing arguments in wrong order
function example2() {
	const showProduct = (name, price) => {
		console.log(`The product ${name} costs ${price}$.`);
		//again, no hints from the editor and no errors at runtime, though the message is inaccurate
	};

	const product = getProduct(1);

	showProduct(product.price, product.name); // The product 99.5 costs $Awesome Gadget 1
}
example2();
