/*
# ENUMS
Enums allow a developer to define a set of named constants.
Using enums can make it easier to document intent, or create a set of distinct cases.
*/
// = numeric enums

// have auto-incrementing feature
enum Direction {
	UP = 1,
	DOWN,
	LEFT,
	RIGHT,
}

// now we can reference values using enum instead of writing them literally
const where: Direction = Direction.DOWN;
console.log('where', where); // 2

enum UserResponse {
	NO = 0,
	YES = 1,
}

function respond(message: UserResponse): void {
	console.log(message);
}
respond(UserResponse.YES);


// with numeric enum you can also pass a literal value instead of referencing it through enum
respond(1);
respond(2);

// = string enums
{
	enum Direction {
		UP = 'Up',
		DOWN = 'Down',
		LEFT = 'Left',
		RIGHT = 'Right',
	}

	let where: Direction;
	where = Direction.UP;
	where = 'Up'; // you cannot use literal value for string enums
}

// ^ enums exist in runtime as real objects!
{
	{
		enum Direction {
			UP = 'Up',
			DOWN = 'Down',
			LEFT = 'Left',
			RIGHT = 'Right',
		}

		// so we can iterate over them
		for (const [key, value] of Object.entries(Direction)) {
			console.log(key, value);
		}
	}

	}

{
	// alternatively, we can use objects with as const
	const Direction = {
		UP: 'Up',
		DOWN: 'Down',
		LEFT: 'Left',
		RIGHT: 'Right',
	} as const;

	type DirectionEnum = (typeof Direction)[keyof typeof Direction];
}

// ^ it is not possible to create generic enums




