# Notes

Compilation comprises three main stages: parsing, transformation, and generation. An internal representation of the source code is created through parsing, then transformations are applied to the representation before a string of code in a target language is generated.

- [Lexing](#lexing)

## Lexing

Parsing is of two types (or stages); the first is lexical analysis, or _lexing_. Lexing reads the source code and turns it into a stream of _tokens_. Tokens are categories of _lexemes_ (that is, words or units) in a language. For example, consider the JavaScript expression `alert('Hi');`. The lexemes in it are `alert`, `(`, `'Hi'`, `)` and `;`. `alert` might correspond to the identifier token, `(` the open parenthesis token, `'Hi'` the string literal token, and so on.

The following is a basic, informal procedure for lexing:
1. Iterate over the source code character by character.
2. Identify the token associated with each lexeme.
3. Add the identified tokens to an array of tokens.

There are some important ways the procedure above could be modified. It is often useful to store some token metadata such as the token's location in the source code, etc. As well, it might not be wise to store all tokens in an array &ndash; consider how large the array would grow when parsing a large file. A third thing is that whitespace tokens (spaces, tabs and newlines) need not be stored, they should only be identified.