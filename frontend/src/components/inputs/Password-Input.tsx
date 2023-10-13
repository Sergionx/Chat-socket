import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./Password-Input.css";
import { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

// TODO - Better autocomplete highlight
export default function PasswordInput(props: Props) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <>
      <label id={props.id} className="text-lg font-semibold ">
        Password
      </label>

      <section
        className="border border-gray-400 rounded-lg p-2 mt-2
        focus-within:ring-2 focus-within:ring-primary-400 bg-gray-100
        flex items-center password-container"
      >
        <input
          id={props.id}
          type={isHidden ? "password" : "text"}
          className="outline-none w-full bg-gray-100 disabled:cursor-not-allowed"
          value={props.value}
          onChange={props.onChange}
          {...props}
        />
        <button type="button" onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? (
            <AiFillEye
              size={24}
              className="text-primary-400 hover:text-primary-500"
            />
          ) : (
            <AiFillEyeInvisible
              size={24}
              className="text-primary-400 hover:text-primary-500"
            />
          )}
        </button>
      </section>
    </>
  );
}
