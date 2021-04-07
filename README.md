# Wasp 🐝

A little dialect of [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) for my learning about compilers, built with [TypeScript](https://www.typescriptlang.org/) and [Deno](https://deno.land/). This is based on a [Frontend Masters](https://frontendmasters.com/) course, [_Building Your Own Programming Language_](https://frontendmasters.com/courses/programming-language). (See [course repo](https://github.com/stevekinney/dropbear).)

## Motivation

I noticed something common to _many_ tools used in frontend (web) development &ndash; they are effectively compilers. Many frontend web projects are written in languages (or at least, syntaxes) other than the languages of the web (i.e. HTML, CSS and JavaScript). For example, you'll find web projects developed with technologies like [React](https://reactjs.org/), [Sass](https://sass-lang.com/), [Nunjucks](https://mozilla.github.io/nunjucks/), etc. Of course, browsers don't understand these languages as is, so they have to be translated to languages that browsers understand. This is where compilers come in. As well, other tools used in the development process like [code formatters](https://prettier.io/), [linters](https://eslint.org/), [bundlers](https://rollupjs.org/guide/en/), and [minifiers](https://terser.org/) work in a way similar to compilers.

## Why Lisp?

The course used Lisp because it has a very simple syntax, unlike most other languages:
* Everything in Lisp is either an atom or a list;
* Also, Lisp uses prefix notation so there's nothing to worry about operator precedence.

## Progress

* Syntax specification ✅ (See [/wasp.abnf](./wasp.abnf))
* Lexer ✅
* Parser ✅
* Basic semantics ✅
* Special forms in progress 🔄
* Type-safety, error handling 🔄
* Interpreter
* Docs

## Setup

To use Wasp, you need to install [Deno](https://deno.land/). Deno is a JavaScript runtime from the creator of [Node](https://nodejs.org/). It's designed to be more standards-compliant, and it supports [TypeScript](https://www.typescriptlang.org/) out-of-the-box.

TODO: How to run

TODO: How to compile

## Directory structure

TODO
