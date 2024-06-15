import {
  type Component,
  type JSX,
  createEffect,
  createMemo,
  useContext,
} from "solid-js";
import { FormContext } from "./form-provider";

interface InputProps<T = string | number | string[]> {
  value: T;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  path: string | string[];
  onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
  onClick?: JSX.EventHandler<HTMLInputElement, MouseEvent>;
}

interface FormFieldProps {
  path: string | string[];
  label: string;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  labelComp?: Component<{ label: string }>;
  errorComp?: Component<{ error: string }>;
  inputComp?: Component<InputProps>;
}

const defaultLabel: Component<{ label: string }> = ({ label }) => (
  <span>{label}</span>
);
const defaultError: Component<{ error?: string }> = ({ error }) =>
  error && <p>{error}</p>;
const defaultInput: Component<InputProps> = (props) => (
  <input
    type={props.type || "text"}
    value={props.value}
    onInput={props.onInput}
    onChange={props.onChange}
    onClick={props.onClick}
  />
);

const FormField: Component<FormFieldProps> = (props) => {
  const { assign, form } = useContext(FormContext);

  const field = createMemo(() => {
    const _form = form();
    const path = Array.isArray(props.path) ? [...props.path] : [props.path];
    const leaf = path.reduce((acc, val) => acc[val], { ..._form });

    if (
      Object.prototype.toString.call(leaf) !== "[object Object]" ||
      !("value" in (leaf as object)) ||
      !("error" in (leaf as object))
    )
      throw new Error(`Failed to retrieve "${path.join(".")}".`);

    return { ...leaf } as { value: string; error: string };
  });

  const LabelComp = props.labelComp || defaultLabel;
  const ErrorComp = props.errorComp || defaultError;
  const InputComp = props.inputComp || defaultInput;

  return (
    <label>
      <LabelComp label={props.label} />
      <InputComp
        path={props.path}
        value={field().value}
        onInput={(ev) => assign(props.path, ev.currentTarget.value)}
      />
      <ErrorComp error={field().error} />
    </label>
  );
};

export default FormField;
