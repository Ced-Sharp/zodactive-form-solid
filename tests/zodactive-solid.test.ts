import type { FormFields } from "@zodactive-form/core";
import type { Accessor } from "solid-js";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import { useForm } from "../src/zodactive-solid";

const userSchema = z.object({
  name: z.string().min(3, "3!"),
  age: z.number().min(18, "18!"),
  displayName: z.string().min(3, "3!").optional(),
});

const matchInitial = {
  name: { value: "", error: "" },
  age: { value: 0, error: "" },
};

const matchInvalid = {
  name: { value: "a", error: "3!" },
  age: { value: 1, error: "18!" },
  displayName: { value: "b", error: "3!" },
};

const matchValidNoOptional = {
  name: { value: "test", error: "" },
  age: { value: 20, error: "" },
};

const matchValidWithOptional = {
  name: { value: "test", error: "" },
  age: { value: 20, error: "" },
  displayName: { value: "Test", error: "" },
};

describe("Zodactive Form - Solid JS", () => {
  it("should return solid signals with proper typing", () => {
    const { form, valid } = useForm(userSchema);
    expectTypeOf(form).toMatchTypeOf<
      Accessor<FormFields<z.infer<typeof userSchema>>>
    >();
    expectTypeOf(valid).toMatchTypeOf<Accessor<boolean>>();
  });

  it("should have the value react to calling `assign()`", () => {
    const { form, assign } = useForm(userSchema);
    expect(form()).toMatchObject(matchInitial);
    assign("name", "test");
    assign("age", 20);
    expect(form()).toMatchObject(matchValidNoOptional);
  });

  it("should have errors react to calling `validate()`", () => {
    const { form, assign, validate } = useForm(userSchema);
    expect(form()).toMatchObject(matchInitial);
    assign("name", "a");
    assign("age", 1);
    assign("displayName", "b");
    validate();
    expect(form()).toMatchObject(matchInvalid);
  });

  it("should have valid react to calling `validate()`", () => {
    const { assign, valid, validate } = useForm(userSchema);
    expect(valid()).toBe(false);
    assign("name", "test");
    assign("age", 20);
    validate();
    expect(valid()).toBe(true);
  });
});
