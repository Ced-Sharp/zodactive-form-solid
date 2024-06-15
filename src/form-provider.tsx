import { type Component, type JSX, createContext } from "solid-js";
import type { useForm } from "./zodactive-solid";

type FormContextType = ReturnType<typeof useForm>;

interface FormProviderProps {
  form: FormContextType;
  children: JSX.Element | JSX.Element[];
}

export const FormContext = createContext<FormContextType>();

const FormProvider: Component<FormProviderProps> = (props) => {
  return (
    <FormContext.Provider value={props.form}>
      {props.children}
    </FormContext.Provider>
  );
};

export default FormProvider;
