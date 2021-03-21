# Wasp 🐝

A little dialect of Lisp I'm building to learn about compilers.

This is based on a [Frontend Masters](https://frontendmasters.com/) course, [_Building Your Own Programming Language_](https://frontendmasters.com/courses/programming-language). (See [course repo](https://github.com/stevekinney/dropbear).)

## Motivation

I was immersed in frontend (web) development to a good extent some months ago, and I noticed something common to _a lot_ of the field's toolchain &ndash; they were effectively compilers.

Many frontend web projects are written in languages (or at least, syntaxes) other than the lingua francua of the web (i.e. HTML, CSS and JavaScript). For example, you'll find web projects developed with technologies like [React](https://reactjs.org/), [Sass](https://sass-lang.com/), [Markdown](https://guides.github.com/features/mastering-markdown/), [TypeScript](https://www.typescriptlang.org/), [Nunjucks](https://mozilla.github.io/nunjucks/), etc. as opposed to pure HTML, CSS, and JavaScript. Of course, browsers don't understand these languages "as is", so they have to be translated into languages that browsers understand. This is where compilers come in.

There's also a significant difference between the code developers write (_development_ code) and what's shipped to users (_production_ code). Development code should be easy for the developer to read and understand, and should follow "best practices" (whatever that may be). As such, development code might be split into (perhaps) hundreds of modules, [linters](https://eslint.org/) might be used to enforce best practices, and [code formatters](https://prettier.io/) might be used to "prettify" code. On the contrary, production code should be optimized for a great user experience. This usually means that the code files should be few and small in size, and that the code be efficient. Bundlers and minifiers like [Rollup](https://rollupjs.org/guide/en/) and [Terser](https://terser.org/) might be used to achieve this. All these tools really do one thing &ndash; they take some source files, represent them in some convenient form, modify the form, and then generate output files &ndash; and that's what a compiler does!
