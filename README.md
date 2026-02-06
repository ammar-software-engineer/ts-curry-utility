# `ts-curry-utility`

## Description

`ts-curry-utility` is a lightweight TypeScript utility library that provides a `curry` function. This function transforms a multi-argument function into a sequence of single-argument functions, making it easier to create specialized functions and enhance code reusability and readability, especially in a functional programming context.

## Features

-   **Type-Safe Currying**: Leverages TypeScript to provide type safety for curried functions, supporting up to 3 arguments explicitly for robust type inference.
-   **Simple API**: An intuitive `curry` function that's easy to integrate into your TypeScript projects.
-   **Functional Programming**: Facilitates a functional programming style by enabling partial application of functions.

## Installation

To install `ts-curry-utility`, use npm or yarn:

```bash
npm install ts-curry-utility
# or
yarn add ts-curry-utility
```

## Usage

### Basic Currying

Here's how you can use the `curry` function:

```typescript
import { curry } from 'ts-curry-utility';

// Original function with 3 arguments
const addThreeNumbers = (a: number, b: number, c: number): number => a + b + c;

// Curry the function
const curriedAdd = curry(addThreeNumbers);

// Call with all arguments at once (chained)
console.log(curriedAdd(1)(2)(3)); // Output: 6

// Call step-by-step (partial application)
const addOne = curriedAdd(1); // Type: (a2: number) => (a3: number) => number
console.log(addOne(2)(3)); // Output: 6

const addOneAndTwo = addOne(2); // Type: (a3: number) => number
console.log(addOneAndTwo(3)); // Output: 6
```

### Currying Functions with Different Arities

The `curry` utility works with functions of various argument counts:

```typescript
import { curry } from 'ts-curry-utility';

// Original function with 2 arguments
const greet = (greeting: string, name: string): string => `${greeting}, ${name}!`;
const curriedGreet = curry(greet);

const sayHello = curriedGreet('Hello'); // Type: (name: string) => string
console.log(sayHello('Alice')); // Output: Hello, Alice!

const sayHi = curriedGreet('Hi');
console.log(sayHi('Bob')); // Output: Hi, Bob!
```

### Currying Functions with Mixed Argument Types

```typescript
import { curry } from 'ts-curry-utility';

interface User { id: number; name: string; email: string; }
const createUser = (id: number, name: string, email: string): User => ({ id, name, email });
const curriedCreateUser = curry(createUser);

const createId1User = curriedCreateUser(1); // (name: string) => (email: string) => User
const createId1Alice = createId1User('Alice'); // (email: string) => User
const aliceUser = createId1Alice('alice@example.com'); // User
console.log(aliceUser); // Output: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

## Type Definition

The `curry` function uses a `CurriedFunction` type to infer the return type based on the number of arguments provided. This type definition is designed to provide good type inference for common use cases.

```typescript
// Simplified Curry type definition for illustration
type CurriedFunction<F extends Function> =
  F extends (arg1: infer A1, arg2: infer A2, arg3: infer A3, ...rest: infer AR) => infer R
    ? (a1: A1) => (a2: A2) => (a3: A3) => (...rest: AR) => R
    : F extends (arg1: infer A1, arg2: infer A2, ...rest: infer AR) => infer R
    ? (a1: A1) => (a2: A2) => (...rest: AR) => R
    : F extends (arg1: infer A1, ...rest: infer AR) => infer R
    ? (a1: A1) => (...rest: AR) => R
    : F; // Fallback for functions that don't match specific arities
```

## Development

To set up the project for development:

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ts-curry-utility.git
    cd ts-curry-utility
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Compile the TypeScript code:
    ```bash
    npm run build
    ```

## License

This project is open-source and available under the [MIT License](LICENSE).