import { FC, useState } from "react";
import { OutlinedPlusIcon } from "../Icons";

interface Props {
  onChange: (_: File) => void;
}
const FileUploadField: FC<Props> = ({ onChange }) => {
  const [id] = useState(Math.random().toString());

  return (
    <div>
      <input
        onChange={(e) => onChange(e.target.files[0])}
        type="file"
        className="appearance-none hidden hide-file-button"
        id={id}
        accept="image/*"
      />
      <label
        htmlFor={id}
        className="border-gray-800 text-sm flex gap-2 items-center cursor-pointer hover:text-gray-200 transition rounded-md bg-gray-800 max-w-max py-1.5 px-4 "
      >
        <OutlinedPlusIcon size={25} />
        <p>Add File</p>
      </label>
    </div>
  );
};

export default FileUploadField;
