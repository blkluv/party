import axios from "axios";
import AddHostMemberFormData from "~/types/AddHostMemberFormData";

const addHostMember = async (memberData: AddHostMemberFormData, hostId: number) => {
  try {
    const { data } = await axios.post(`/api/hosts/${hostId}/roles`, memberData);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addHostMember;
