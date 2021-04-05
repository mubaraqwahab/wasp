# Wasp 🐝

A little dialect of [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) for my learning about compilers, built with [TypeScript](https://www.typescriptlang.org/) and [Deno](https://deno.land/).

This is based on a [Frontend Masters](https://frontendmasters.com/) course, [_Building Your Own Programming Language_](https://frontendmasters.com/courses/programming-language). (See [course repo](https://github.com/stevekinney/dropbear).)

## Motivation

I noticed something common to _many_ tools used in frontend (web) development &ndash; they are effectively compilers.

Many frontend web projects are written in languages (or at least, syntaxes) other than the languages of the web (i.e. HTML, CSS and JavaScript). For example, you'll find web projects developed with technologies like [React](https://reactjs.org/), [Sass](https://sass-lang.com/), [Markdown](https://guides.github.com/features/mastering-markdown/), [TypeScript](https://www.typescriptlang.org/), [Nunjucks](https://mozilla.github.io/nunjucks/), etc. as opposed to pure HTML, CSS, and JavaScript. Of course, browsers don't understand these languages as is, so they have to be translated into languages that browsers understand. This is where compilers come in.

There's also a significant difference between the code developers write (_development_ code) and what's shipped to users (_production_ code). Development code should be easy for the developer to read and understand, and should follow "best practices" (whatever those may be). As such, development code might be split into (perhaps) hundreds of modules, [linters](https://eslint.org/) might be used to enforce best practices, and [code formatters](https://prettier.io/) might be used to "prettify" code. On the contrary, production code should be optimized for a great user experience. This usually means that the code files should be few and small in size, and that the code be efficient. Bundlers and minifiers like [Rollup](https://rollupjs.org/guide/en/) and [Terser](https://terser.org/) might be used to achieve this. All these tools really do one thing &ndash; they take some source files, represent them in some convenient form, modify the form, and then generate output files &ndash; and that's what a compiler does!

## Why Lisp?

The course used Lisp because it has a very simple syntax, unlike most other languages:
* Everything in Lisp is either an atom or a list;
* Also, Lisp uses prefix notation so there's nothing to worry about operator precedence.

## Progress

* Syntax specification ✅ (See [/wasp.abnf](./wasp.abnf))
* Lexer ✅
* Parser ✅
* Basic semantics ✅
* Special forms in progress. 🔄
* Interpreter
* Docs

## Setup

To use Wasp, you need to install [Deno](https://deno.land/). Deno is a JavaScript runtime from the creator of [Node](https://nodejs.org/). It's designed to be more standards-compliant, and it supports TypeScript out-of-the-box.

TODO: How to run

TODO: How to compile

## Directory structure

TODO
