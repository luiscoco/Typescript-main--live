/*
# UNION AND INTERSECTION TYPES
*/

{
	/*
  # union types
  A union type is written as a series of other types with a | vertical pipe between them.
  means 'any of' (similar to || conditional operator in JS)

  When a value is a union type, TypeScript will only allow access to members that exist on all possible types.
  */
	{
		{
			type Status = 'todo' | 'in progress' | 'fulfilled';

			let status: Status = 'in progress'; // *ok
			status = 'pending'; // ! error
		}

		{
			type Match = {
				name: string;
				date: Date;

				score: string;
			};

			type Concert = {
				name: string;
				date: Date;

				lineup: string;
			};

			type Event = Match | Concert;

			let event: Event;

			event = {
				name: 'opera',
				date: new Date(),
				score: '3:0',
			};

			console.log(event.lineup); // resulting type will have only the common properties guaranteed
		}

		{
			// union type for a function argument;
			function printStatusCode(code: string | number) {
				console.log(
					`My status code is ${
						typeof code === 'string' ? code.toUpperCase() : code
					}.`
				);
			}
			printStatusCode(404);
			printStatusCode('404');
		}

		{
			// union types are used to represent values that can be null or undefined
			type Knowledge = 'Typescript' | null;
		}
	}

}

{
	/*
  # intersection types
  means 'all of' (similar to && conditional operator in JS)

  An intersection type combines multiple types into one.
  This allows you to add together existing types to get a single type that has all the features you need.
  */
	// ~ intersection type
	{
		type User = {
			name: string;
			password: string;
		};

		type Admin = {
			admin: boolean;
		};

		type AdminUser = User & Admin;

		const admin: AdminUser = {
			name: 'Fred',
			password: '123',
			admin: true,
		};
	}

	{
		// We can achieve a similar result with interfaces
		// intersection type alias works the same as interface extending other interface

		// ~ using interfaces
		{
			interface User {
				name: string;
				password: string;
			}

			interface Admin {
				admin: boolean;
			}

			interface AdminUser extends User, Admin {}

			const admin: AdminUser = {
				name: 'Fred',
				password: '123',
				admin: true,
			};
		}
	}

	{
		// ~ we can combine this 2 approaches, e.g. construct type from interfaces
		interface Person {
			name: string;
			surname: string;
		}

		// to make a citizen, we need to make sure that he is identifiable and can vote.
		// we declare these features as separate interfaces
		interface HasId {
			id: string;
		}

		interface CanVote {
			vote: () => string;
		}

		// and construct the intersection type that will combine all the interfaces
		type Citizen = Person & HasId & CanVote;

		// interface Citizen extends Person, HasId, CanVote // the same, using interface

		// but with type alias we get more information from IDE about its structure

		const citizen: Citizen = {
			name: 'John',
			surname: 'Doe',
			id: '123',

			vote() {
				return 'I vote for...';
			},
		};

		// we can construct another intersection type - Worker, using another combination of types/interfaces
		interface HasSalary {
			salary: number;
		}

		type Worker = Person & HasSalary;

		const worker: Worker = {
			name: 'Harry',
			surname: 'Jenkins',
			salary: 1000,
		};

		// interface Worker extends Person, HasSalary {} // the same, using interface

		
			}
}
