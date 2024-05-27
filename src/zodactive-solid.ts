import { z } from "zod";
import {
	FormFields,
	useZodactiveForm,
	type ZodactiveOptions,
} from "@zodactive-form/core";
import { createSignal, type Signal } from "solid-js";

export const useForm = <S extends z.ZodObject<z.ZodRawShape>>(
	schema: S,
	initialData?: z.TypeOf<S>,
) => {
	const options: ZodactiveOptions<Signal<unknown>> = {
		createReactive: () => createSignal(),
		setReactive: ([_, setSignal], value) => setSignal(value),
		getReactive: ([signal]) => signal(),
	};

	const {
		assign,
		form: rawForm,
		valid: rawValid,
		validate,
	} = useZodactiveForm<S, Signal<unknown>>(options, schema, initialData);

	const form = rawForm as Signal<FormFields<z.TypeOf<S>>>;
	const valid = rawValid as Signal<boolean>;

	return { assign, form: form[0], valid: valid[0], validate };
};
