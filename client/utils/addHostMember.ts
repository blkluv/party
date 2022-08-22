import axios from "axios";
import AddHostMemberFormData from "~/types/AddHostMemberFormData";

const addHostMember = async (memberData: AddHostMemberFormData, hostId: number, token: string) => {
  try {
    const { data } = await axios.post(`/api/hosts/${hostId}/roles`, memberData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addHostMember;
