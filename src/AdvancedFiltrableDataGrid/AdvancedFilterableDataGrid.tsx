import React, { useState, useCallback, useEffect } from "react";
import { FilterBuilder, IFilter } from "@chax-at/prisma-filter-common";
import { Box, Typography } from "@mui/material";
import { FilterableTable } from "./FilterableTable.tsx";
import { QueryStringDisplay } from "./QueryStringDisplay.tsx";

export interface Column<T> {
  field: keyof T;
  headerName: string;
  width: number;
  type: "string" | "number" | "date";
}

export interface ServerResponse<T> {
  data: T[];
  count: number;
}

interface AdvancedFilterableDataGridProps<T> {
  columns: Column<T>[];
  fetchData: (filters: IFilter<T>) => Promise<ServerResponse<T>>;
  initialFilters?: IFilter<T>;
}

export function AdvancedFilterableDataGrid<T>({
  columns,
  fetchData,
  initialFilters = { filter: [], order: [], offset: 0, limit: 10 },
}: AdvancedFilterableDataGridProps<T>) {
  const [filters, setFilters] = useState<IFilter<T>>(initialFilters);
  const [queryString, setQueryString] = useState<string>("");
  const [serverResponse, setServerResponse] = useState<ServerResponse<T>>({
    data: [],
    count: 0,
  });

  const updateQueryString = useCallback(
    (newFilters: IFilter<T>) => {
      const filterBuilder = new FilterBuilder<T>();

      newFilters.filter?.forEach((filter) => {
        filterBuilder.addFilter(filter.field, filter.type, filter.value);
      });

      newFilters.order?.forEach((order) => {
        filterBuilder.addOrderBy(order.field, order.dir);
      });

      filterBuilder.setPageSize(newFilters.limit || 10);
      filterBuilder.requestPage(
        Math.floor((newFilters.offset || 0) / (newFilters.limit || 10)) + 1
      );

      const newQueryString = filterBuilder.toQueryString();
      setQueryString(newQueryString);

      fetchData(newFilters).then(setServerResponse);
    },
    [fetchData]
  );

  useEffect(() => {
    updateQueryString(filters);
  }, [filters, updateQueryString]);

  const handleFiltersChange = useCallback((newFilters: IFilter<T>) => {
    setFilters(newFilters);
  }, []);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h4" gutterBottom>
        Advanced Filterable DataGrid
      </Typography>
      <QueryStringDisplay queryString={queryString} />
      <FilterableTable<T>
        columns={columns}
        data={serverResponse.data}
        totalCount={serverResponse.count}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </Box>
  );
}
