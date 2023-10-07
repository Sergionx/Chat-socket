import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isPasswordHidden: boolean;
  onChangePasswordHidden: () => void;
}

// TODO - Better autocomplete highlight
export default function PasswordInput(props: Props) {
  const { isPasswordHidden, onChangePasswordHidden, ...inputProps } = props;

  return (
    <>
      <label id={props.id} className="text-lg font-semibold ">
        Password
      </label>

      <section
        className="border border-gray-400 rounded-lg p-2 mt-2
        focus-within:ring-2 focus-within:ring-primary-400 bg-gray-100
        flex items-center"
      >
        <input
          id={props.id}
          type={isPasswordHidden ? "password" : "text"}
          className="outline-none w-full bg-gray-100"
          value={props.value}
          onChange={props.onChange}
          {...inputProps}
        />
        <button type="button" onClick={onChangePasswordHidden}>
          {isPasswordHidden ? (
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
