import { FC } from "react";
import UserHostRole from "~/types/UserHostRole";

interface Props {
  roles: UserHostRole[];
}

const HostRolesTable: FC<Props> = ({ roles }) => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th className="border border-gray-700 px-2 py-1 bg-gray-800">Email</th>
          <th className="border border-gray-700 px-2 py-1 bg-gray-800">Role</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((user) => (
          <tr key={user.id}>
            <td className="px-2 py-1 border border-gray-700">{user.email}</td>
            <td className="px-2 py-1 border border-gray-700">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HostRolesTable;
