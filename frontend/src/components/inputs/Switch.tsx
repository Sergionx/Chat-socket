interface Props {
  onCheck: (checked: boolean) => void;
  value: boolean;
  id: string;
}

export default function Switch({ onCheck, value, id }: Props) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={value}
        className="sr-only peer"
        onChange={(event) => {
          onCheck(event.target.checked);
        }}
      />
      <div
        className="w-[4rem] h-8 border-2 border-gray-300 rounded-full peer
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-400
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          bg-gray-200 peer-checked:bg-primary-500 
          after:content-[''] after:absolute after:top-[5px] after:left-[6px]
          peer-checked:after:left-[12px] peer-checked:translate-x
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-[22px] after:w-[22px] after:transition-all after:ease-in-out after:duration-300"
      ></div>
    </label>
  );
}
