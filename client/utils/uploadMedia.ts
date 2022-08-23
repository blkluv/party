import axios from "axios";

const uploadMedia = async (url: string, file: File) => {
  const tmpAxios = axios.create();
  await tmpAxios.put(url, file);
};

export default uploadMedia;
