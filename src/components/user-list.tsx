import { useEffect, useState } from "react";
import ExpandableTable from "./table";

interface Item {
  id: number;
  name: string;
  email: string;
  details: Record<string, string>;
}

const columns = [
  {
    header: "Name",
    accessor: "name" as keyof Item,
  },
  {
    header: "Email",
    accessor: "email" as keyof Item,
  },
];

export const UserList = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const _data = await response.json();
    if (!response.ok) {
      console.error("Failed to fetch data");
      return;
    }
    const formatData: Item[] = _data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email?.toLowerCase(),
      details: {
        address: `${item.address.suite} ${item.address.street}, ${item.address.city}`,
        company: item.company.name,
      },
    }));
    setData(formatData);
    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExpandableTable
          data={data}
          columns={columns}
          isExpandable={true}
          renderSubContent={(item) => <UserDetails details={item.details} />}
        />
      )}
    </div>
  );
};

const UserDetails: React.FC<{ details: Item["details"] }> = ({ details }) => (
  <div className="flex justify-start">
    <table className="divide-y divide-gray-200 min-w-full">
      <tbody className="divide-y divide-gray-200">
        <tr>
          <th className="px-4 py-1 text-left text-[11px] font-medium text-gray-500 uppercase">
            ADDRESS:
          </th>
          <td className="text-xs text-left">{details.address}</td>
        </tr>
        <tr>
          <th className="px-4 py-1 text-left text-[11px] font-medium text-gray-500 uppercase">
            COMPANY:
          </th>
          <td className="text-xs text-left">{details.company}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
