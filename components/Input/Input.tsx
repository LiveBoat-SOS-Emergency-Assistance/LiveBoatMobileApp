import { TextInput } from "react-native";
interface InputProps {
  placeholder: string;
  isPassword?: boolean;
}
const Input = ({ placeholder, isPassword = false }: InputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      className="w-[90%] border border-[#D9D9D9] h-[54px] rounded-[5px] px-4 outline-none"
      secureTextEntry={isPassword}
    ></TextInput>
  );
};

export default Input;
