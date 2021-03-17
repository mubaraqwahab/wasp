# Notes

Compilation comprises three main stages: parsing, transformation, and generation. An internal representation of the source code is created through parsing, then transformations are applied to the representation before a string of code in a target language is generated.

- [Lexing](#lexing)

## Lexing

Parsing is of two types (or stages); the first is _lexical analysis_, or _lexing_. Lexing reads the source code and turns it into a stream of _tokens_. Tokens are categories of _lexemes_ (that is, words or units) in a language. For example, consider the JavaScript expression `alert('Hi');`. The lexemes in it are `alert`, `(`, `'Hi'`, `)` and `;`. `alert` might correspond to the identifier token, `(` the open parenthesis token, `'Hi'` the string literal token, and so on.