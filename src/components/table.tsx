import React, { useState } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid"; // Using Heroicons for icons

interface Column<T> {
  header: string;
  accessor?: keyof T;
  renderCell?: (item: T) => React.ReactNode;
}

interface ExpandableTableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  renderSubContent?: (item: T) => React.ReactNode;
  isExpandable?: boolean;
}

function ExpandableTable<T extends { id: number | string }>({
  data,
  columns,
  renderSubContent,
  isExpandable = true, // Default to true
}: ExpandableTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<
    Record<number | string, boolean>
  >({});

  const handleRowClick = (id: number | string) => {
    if (isExpandable) {
      setExpandedRows((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {isExpandable && <th className="w-4"></th>}{" "}
          {/* Empty header for the icon column */}
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <React.Fragment key={item.id}>
            <tr
              onClick={() => handleRowClick(item.id)}
              className={`hover:bg-gray-100 ${
                isExpandable ? "cursor-pointer" : ""
              }`}
            >
              {isExpandable && (
                <td className="w-4">
                  {renderSubContent ? (
                    expandedRows[item.id] ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 inline" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-500 inline" />
                    )
                  ) : null}
                </td>
              )}
              {columns.map((column, index) => (
                <td
                  key={index}
                  className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-900"
                >
                  {column.renderCell
                    ? column.renderCell(item)
                    : (item[column.accessor!] as React.ReactNode)}
                </td>
              ))}
            </tr>
            {isExpandable && expandedRows[item.id] && renderSubContent && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-4 bg-gray-50"
                >
                  {renderSubContent(item)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default ExpandableTable;
