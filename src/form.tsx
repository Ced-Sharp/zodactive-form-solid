import type { Component, JSX } from "solid-js";
import type { useForm } from "./zodactive-solid";

import FormProvider from "./form-provider";

export interface FormProps {
  id?: string;
  className?: string;
  hideErrors?: boolean;

  form: ReturnType<typeof useForm>;
  children: JSX.Element | JSX.Element[];

  /** Called when the form is submitted and is valid */
  onSubmit?: () => void;

  /** Provide a custom component for displaying errors */
  errorsComponent?: Component<{ errors: string[] }>;

  actionsComponent?: Component;
}

const defaultErrorsComponent: Component<{ errors: string[] }> = ({ errors }) =>
  errors.map((error) => <p>{error}</p>);

const defaultActionsComponent: Component = () => (
  <button type="submit">Submit</button>
);

const Form: Component<FormProps> = (props) => {
  const { formErrors, validate } = props.form;

  const handleSubmit = (ev: SubmitEvent) => {
    ev.preventDefault();
    if (validate() && props.onSubmit) {
      props.onSubmit();
    }
  };

  return (
    <FormProvider form={props.form}>
      <form onSubmit={handleSubmit}>
        {props.children}
        {!props.hideErrors && props.errorsComponent
          ? props.errorsComponent({ errors: formErrors() })
          : defaultErrorsComponent({ errors: formErrors() })}
        {props.actionsComponent
          ? props.actionsComponent({})
          : defaultActionsComponent({})}
      </form>
    </FormProvider>
  );
};

export default Form;
