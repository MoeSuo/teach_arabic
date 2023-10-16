import { useState } from "react";
import FormInput from "./input/formInput";

export default function Form(props) {
  const initialFields = {};
  props.fields.forEach((field) => {
    initialFields[field.name] = field.value;
  });

  // console.log(initialFields);
  const [formValue, setFormValue] = useState(initialFields);

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
    // console.log(formValue);
  };

  const doSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(formValue);
  };

  return (
    <form className="w-full space-y-4" onSubmit={doSubmit}>
      {props.fields.map((field) => {
        return (
          <FormInput
            {...field}
            value={formValue[field.value]}
            onChange={handleChange}
            key={field.name}
          />
        );
      })}
      {props.children}
    </form>
  );
}
