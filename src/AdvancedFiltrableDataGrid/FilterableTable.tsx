import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FilterOperationType, IFilter } from "@chax-at/prisma-filter-common";
import { Column } from "./AdvancedFilterableDataGrid.tsx";
import { FilterPopover } from "./FilterPopover.tsx";

interface FilterableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalCount: number;
  filters: IFilter<T>;
  onFiltersChange: (filters: IFilter<T>) => void;
}

export function FilterableTable<T>({
  columns,
  data,
  totalCount,
  filters,
  onFiltersChange,
}: FilterableTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openFilterField, setOpenFilterField] = useState<keyof T | null>(null);

  const handleSortChange = useCallback(
    (field: keyof T) => {
      setSortField((prevSortField) => {
        const newSortField = field;
        setSortDirection((prevSortDirection) => {
          const newSortDirection =
            field === prevSortField
              ? prevSortDirection === "asc"
                ? "desc"
                : "asc"
              : "asc";

          onFiltersChange({
            ...filters,
            order: [
              {
                field: newSortField as keyof T & string,
                dir: newSortDirection,
              },
            ],
          });

          return newSortDirection;
        });
        return newSortField;
      });
    },
    [filters, onFiltersChange]
  );

  const handleFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    field: keyof T
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenFilterField(field);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setOpenFilterField(null);
  };

  const handleFilterChange = useCallback(
    (
      field: keyof T,
      newFilters: { type: FilterOperationType; value: string }[]
    ) => {
      onFiltersChange({
        ...filters,
        filter: [
          ...(filters.filter?.filter((f) => f.field !== field) || []),
          ...newFilters.map((f) => ({
            field: field as keyof T & string,
            ...f,
          })),
        ],
      });
    },
    [filters, onFiltersChange]
  );

  const handleRemoveFilter = (field: keyof T, index: number) => {
    const updatedFilters =
      filters.filter?.filter((f, i) => f.field !== field || i !== index) || [];
    onFiltersChange({ ...filters, filter: updatedFilters });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onFiltersChange({
      ...filters,
      offset: newPage * (filters.limit || 10),
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      limit: parseInt(event.target.value, 10),
      offset: 0,
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="filterable table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field as string}
                  style={{ width: column.width }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle2">
                      {column.headerName}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleSortChange(column.field)}
                        aria-label={`Sort by ${column.headerName}`}
                      >
                        {sortField === column.field ? (
                          sortDirection === "asc" ? (
                            <ArrowUpwardIcon fontSize="small" />
                          ) : (
                            <ArrowDownwardIcon fontSize="small" />
                          )
                        ) : (
                          <ArrowUpwardIcon fontSize="small" color="disabled" />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          handleFilterClick(event, column.field)
                        }
                        aria-label={`Filter ${column.headerName}`}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Display applied filters as chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, flexWrap: "wrap" }}
                  >
                    {filters.filter
                      ?.filter((f) => f.field === column.field)
                      .map((filter, index) => (
                        <Chip
                          key={index}
                          label={`${filter.type}: ${filter.value}`}
                          onDelete={() =>
                            handleRemoveFilter(column.field, index)
                          }
                          color="primary"
                          size="small"
                        />
                      ))}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${column.field as string}`}>
                    {String(row[column.field])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={filters.limit || 10}
        page={Math.floor((filters.offset || 0) / (filters.limit || 10))}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <FilterPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        field={openFilterField}
        column={columns.find((c) => c.field === openFilterField)}
        filters={
          filters.filter?.filter((f) => f.field === openFilterField) || []
        }
        onFilterChange={handleFilterChange}
      />
    </>
  );
}
