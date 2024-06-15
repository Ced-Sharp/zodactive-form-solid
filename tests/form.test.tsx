import { fireEvent, render, screen } from "solid-testing-library";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { useForm } from "../src/zodactive-solid";

import Form from "../src/form";
import FormField from "../src/form-field";

const registerSchema = z
  .object({
    username: z.string().min(3),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    age: z.coerce.number().min(18),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "P!",
  );

describe("Zodactive Form - Solid - Form Component", () => {
  it("should render default components", () => {
    const form = useForm(registerSchema);

    render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
        <FormField label="Password" type="password" path="password" />
        <FormField label="Age" type="number" path="age" />
      </Form>
    ));

    const usernameLabel = screen.getByText("Username");
    const passwordLabel = screen.getByText("Password");
    const ageLabel = screen.getByText("Age");

    expect(usernameLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(ageLabel).toBeInTheDocument();
  });

  it("should render initial data in the components", () => {
    const form = useForm(registerSchema, {
      username: "a",
      password: "b",
      confirmPassword: "c",
      age: 1,
    });

    const { container } = render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
        <FormField label="Password" type="password" path="password" />
        <FormField
          label="Confirm Password"
          type="password"
          path="confirmPassword"
        />
        <FormField label="Age" type="number" path="age" />
      </Form>
    ));

    const inputs = container.querySelectorAll("input");

    expect(inputs).toHaveLength(4);
    expect(inputs[0]).toHaveProperty("value", "a");
    expect(inputs[1]).toHaveProperty("value", "b");
    expect(inputs[2]).toHaveProperty("value", "c");
    expect(inputs[3]).toHaveProperty("value", "1");
  });

  it("should update the reactive data when updating inputs", () => {
    const form = useForm(registerSchema);

    const { container } = render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
      </Form>
    ));

    const input = container.querySelector("input");

    expect(input).toHaveProperty("value", "");

    fireEvent.input(input, { target: { value: "test" } });

    expect(form.form().username.value).toBe("test");
  });

  it("should update the inputs when updating the reactive data", () => {
    const form = useForm(registerSchema);

    const { container } = render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
      </Form>
    ));

    const input = container.querySelector("input");

    expect(input).toHaveProperty("value", "");

    form.assign("username", "test");

    expect(form.form().username.value).toBe("test");
    expect(input).toHaveProperty("value", "test");
  });

  it("should not update other fields when updating a field", () => {
    const form = useForm(registerSchema);

    const { container } = render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
        <FormField label="Password" path="password" type="password" />
        <FormField label="Age" path="age" type="number" />
      </Form>
    ));

    const inputs = container.querySelectorAll("input");

    expect(inputs[0]).toHaveProperty("value", "");
    expect(inputs[1]).toHaveProperty("value", "");
    expect(inputs[2]).toHaveProperty("value", "0");

    form.assign("password", "test");

    expect(inputs[0]).toHaveProperty("value", "");
    expect(inputs[1]).toHaveProperty("value", "test");
    expect(inputs[2]).toHaveProperty("value", "0");
  });

  it("should show an error when form is invalid", () => {
    const form = useForm(registerSchema);
    form.validate();

    const { container } = render(() => (
      <Form form={form}>
        <FormField label="Username" path="username" />
      </Form>
    ));

    const error = container.querySelector("input + p");
    expect(error).toBeTruthy();
    expect(error).toContainHTML("at least 3 character");
  });

  it("should emit submit event if form is valid when submitting", () => {
    const onSubmit = vi.fn();
    const form = useForm(registerSchema);
    const { container } = render(() => (
      <Form form={form} onSubmit={onSubmit}>
        <FormField label="Username" path="username" />
        <FormField label="Password" path="password" type="password" />
        <FormField
          label="Confirm Password"
          path="confirmPassword"
          type="password"
        />
        <FormField label="Age" path="age" type="number" />
        <button type="submit">Submit</button>
      </Form>
    ));

    const submit = container.querySelector("form")?.querySelector("button");
    const inputs = container.querySelectorAll("input");

    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.input(inputs[0], { target: { value: "test" } });
    fireEvent.input(inputs[1], { target: { value: "testtest" } });
    fireEvent.input(inputs[2], { target: { value: "testtest" } });
    fireEvent.input(inputs[3], { target: { value: 20 } });
    fireEvent.click(submit);

    expect(onSubmit).toHaveBeenCalled();
  });
});
