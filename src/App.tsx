import React from "react";
import {
  AdvancedFilterableDataGrid,
  Column,
  ServerResponse,
} from "./AdvancedFiltrableDataGrid/AdvancedFilterableDataGrid";
import { IFilter } from "@chax-at/prisma-filter-common";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
  joinDate: string;
}

const columns: Column<User>[] = [
  { field: "name", headerName: "Name", width: 150, type: "string" },
  { field: "email", headerName: "Email", width: 200, type: "string" },
  { field: "role", headerName: "Role", width: 120, type: "string" },
  { field: "age", headerName: "Age", width: 100, type: "number" },
  { field: "joinDate", headerName: "Join Date", width: 150, type: "date" },
];

const initialRows: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    age: 30,
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    age: 28,
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    age: 35,
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Admin",
    age: 32,
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    age: 27,
    joinDate: "2023-05-12",
  },
];

function App() {
  const fetchData = async (
    filter: IFilter<User>
  ): Promise<ServerResponse<User>> => {
    // Simulated API call

    return {
      data: initialRows,
      count: initialRows.length,
    };
  };

  return (
    <AdvancedFilterableDataGrid<User>
      columns={columns}
      fetchData={fetchData}
      initialFilters={{ filter: [], order: [], offset: 0, limit: 10 }}
    />
  );
}

export default App;
