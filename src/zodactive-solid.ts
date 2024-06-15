import {
  type FormFields,
  type Obj,
  type ObjEffect,
  type ZodactiveOptions,
  useZodactiveForm,
} from "@zodactive-form/core";
import { type Signal, createSignal } from "solid-js";
import type { z } from "zod";

export const useForm = <S extends Obj | ObjEffect>(
  schema: S,
  initialData?: z.TypeOf<S>,
) => {
  const options: ZodactiveOptions<Signal<unknown>> = {
    createReactive: () => createSignal(),
    setReactive: ([_, setSignal], value) => {
      switch (Object.prototype.toString.call(value)) {
        case "[object Object]":
          setSignal({ ...(value as object) });
          break;
        case "[object Array]":
          setSignal([...(value as unknown[])]);
          break;
        default:
          setSignal(value);
      }
    },
    getReactive: ([signal]) => signal(),
  };

  const {
    assign,
    form: rawForm,
    formErrors: rawFormErrors,
    valid: rawValid,
    validate,
  } = useZodactiveForm<S, Signal<unknown>>(options, schema, initialData);

  const form = rawForm as Signal<FormFields<z.TypeOf<S>>>;
  const formErrors = rawFormErrors as Signal<string[]>;
  const valid = rawValid as Signal<boolean>;

  return {
    assign,
    form: form[0],
    formErrors: formErrors[0],
    valid: valid[0],
    validate,
  };
};
