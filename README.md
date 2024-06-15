[npm]: https://img.shields.io/npm/v/@zodactive-form/solid
[npm-url]: https://www.npmjs.com/package/@zodactive-form/solid
[size]: https://packagephobia.now.sh/badge?p=@zodactive-form/solid
[size-url]: https://packagephobia.now.sh/result?p=@zodactive-form/solid
[libera]: https://img.shields.io/badge/libera-manifesto-lightgrey.svg
[libera-url]: https://liberamanifesto.com

<h1 align="center">Zodactive Form</h1>
<h2 align="center">Solid JS</h2>

<p align="center">
    Zodactive Form aims to provide very simple form reactivity
    based on the Zod validation library.
</p>

<p align="center">

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![libera manifesto][libera]][libera-url]

</p>

## Preface

This is not an official Zod library. This is a personal project which is mainly meant
to be used by my other projects. However, you are free to use it if you find it useful.

In addition, this library is under development and not all functionality from zod is
supported yet.

## Description

The Solid JS adapter is a wrapper around the @zodactive-form/core library and provides
signals which will updated based on the state of a form which is validated with Zod.

## Dependencies

This library uses zod to handle validation and @zodactive-form/core since it is an
adapter for it.

## Installation

As a simple npm package, it can be installed using your favorite package manager:

```shell
npm install @zodactive-form/solid
```

## Usage

This adapter expects a Zod schema and will return methods to interact with the form and
signals for reactivity.

```tsx
import { z } from 'zod';
import { useForm } from '@zodactive-form/solid';

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    remember: z.boolean().optional(),
})

export default () => {
    const { assign, form, valid, validate } = useForm(loginSchema);
    
    const handleSubmit = (ev: SubmitEvent) => {
        ev.preventDefault();
        // form is valid
    }

    return (
        <Form form={form} onSubmit={handleSubmit}>
            <FormField path="username" label="Username" />
            <FormField path="password" label="Password" />
            <FormField path="remember" type="checkbox" label="Age" />
        </Form>
    );
};
```

