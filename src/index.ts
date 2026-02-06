// Helper type to extract arguments from a function type
type Args<F> = F extends (...args: infer A) => any ? A : never;

// Helper type to extract return type from a function type
type Return<F> = F extends (...args: any[]) => infer R ? R : never;

// Curry type definition
// This is a simplified version; full-blown curry types are very complex to get right for all arities.
// This supports up to 3 arguments in a type-safe way and then falls back to any for more.
type CurriedFunction<F extends Function> =
  F extends (arg1: infer A1, arg2: infer A2, arg3: infer A3, ...rest: infer AR) => infer R
    ? (a1: A1) => (a2: A2) => (a3: A3) => (...rest: AR) => R
    : F extends (arg1: infer A1, arg2: infer A2, ...rest: infer AR) => infer R
    ? (a1: A1) => (a2: A2) => (...rest: AR) => R
    : F extends (arg1: infer A1, ...rest: infer AR) => infer R
    ? (a1: A1) => (...rest: AR) => R
    : F; // Fallback if no specific currying type matches

/**
 * Transforms a multi-argument function into a sequence of single-argument functions (currying).
 * This implementation provides basic currying logic.
 * For true type inference on complex currying (e.g., variadic tuple types and preserving arity),
 * a more advanced type definition would be required, often seen in libraries like Ramda.
 *
 * @param fn The function to curry.
 * @returns A curried version of the function.
 */
function curry<F extends Function>(fn: F): CurriedFunction<F> {
  const arity = fn.length; // Number of expected arguments

  function curried(...args: any[]): any {
    if (args.length >= arity) {
      // If enough arguments are provided, call the original function
      return fn(...args);
    } else {
      // Otherwise, return a new function that takes the remaining arguments
      return (...nextArgs: any[]) => curried(...args.concat(nextArgs));
    }
  }

  return curried as CurriedFunction<F>;
}

// --- Example Usage ---

// Original function with 3 arguments
const addThreeNumbers = (a: number, b: number, c: number): number => a + b + c;

// Curry the function
const curriedAdd = curry(addThreeNumbers);

// Call with all arguments at once (not ideal for type inference in this simple type, but works runtime)
console.log('Curried add (all at once):', curriedAdd(1)(2)(3)); // Should be 6

// Call step-by-step
const addOne = curriedAdd(1); // Type: (a2: number) => (a3: number) => number
console.log('addOne type check (addOne(2)(3)):', addOne(2)(3)); // Should be 6

const addOneAndTwo = addOne(2); // Type: (a3: number) => number
console.log('addOneAndTwo type check (addOneAndTwo(3)):', addOneAndTwo(3)); // Should be 6

// Original function with 2 arguments
const greet = (greeting: string, name: string): string => `${greeting}, ${name}!`;
const curriedGreet = curry(greet);

const sayHello = curriedGreet('Hello'); // Type: (name: string) => string
console.log('sayHello type check (sayHello('Alice')):', sayHello('Alice')); // Hello, Alice!

const sayHi = curriedGreet('Hi');
console.log('sayHi type check (sayHi('Bob')):', sayHi('Bob')); // Hi, Bob!

// Function with multiple argument types
const createUser = (id: number, name: string, email: string): { id: number, name: string, email: string } => ({ id, name, email });
const curriedCreateUser = curry(createUser);

const createId1User = curriedCreateUser(1); // (name: string) => (email: string) => User
const createId1Alice = createId1User('Alice'); // (email: string) => User
const aliceUser = createId1Alice('alice@example.com'); // User
console.log('Created Alice User:', aliceUser);

// Non-curried version for comparison
console.log('Non-curried addThreeNumbers:', addThreeNumbers(10, 20, 30));
