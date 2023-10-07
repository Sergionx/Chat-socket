import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface Props {
  id: string;

  isPasswordHidden: boolean;
  password: string;
  onChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePasswordHidden: () => void;
}

export default function PasswordInput({
  id,
  isPasswordHidden,
  onChangePassword,
  onChangePasswordHidden,
  password,
}: Props) {
  return (
    <section
      className="border border-gray-400 rounded-lg p-2 mb-6 
        focus-within:ring-2 focus-within:ring-primary-400 bg-gray-100
        flex items-center"
    >
      <input
        type={isPasswordHidden ? "password" : "text"}
        id={id}
        className="outline-none w-full bg-gray-100"
        value={password}
        onChange={onChangePassword}
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
  );
}
