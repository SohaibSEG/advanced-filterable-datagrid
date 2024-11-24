import React from "react";
import { useState, useEffect } from "react";
import {
  Popover,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Column } from "./AdvancedFilterableDataGrid";

interface FilterPopoverProps<T> {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  field: keyof T | null;
  column: Column<T> | undefined;
  filters: { type: FilterOperationType; value: string }[];
  onFilterChange: (
    field: keyof T,
    filters: { type: FilterOperationType; value: string }[]
  ) => void;
}

const filterOperations = {
  string: [
    { value: FilterOperationType.Eq, label: "Equals" },
    { value: FilterOperationType.Ne, label: "Not Equals" },
    { value: FilterOperationType.Contains, label: "Contains" },
    { value: FilterOperationType.StartsWith, label: "Starts With" },
    { value: FilterOperationType.EndsWith, label: "Ends With" },
  ],
  number: [
    { value: FilterOperationType.Eq, label: "Equals" },
    { value: FilterOperationType.Ne, label: "Not Equals" },
    { value: FilterOperationType.Lt, label: "Less Than" },
    { value: FilterOperationType.Lte, label: "Less Than or Equal" },
    { value: FilterOperationType.Gt, label: "Greater Than" },
    { value: FilterOperationType.Gte, label: "Greater Than or Equal" },
  ],
  date: [
    { value: FilterOperationType.Eq, label: "Equals" },
    { value: FilterOperationType.Ne, label: "Not Equals" },
    { value: FilterOperationType.Lt, label: "Before" },
    { value: FilterOperationType.Lte, label: "Before or On" },
    { value: FilterOperationType.Gt, label: "After" },
    { value: FilterOperationType.Gte, label: "After or On" },
  ],
};

export function FilterPopover<T>({
  open,
  anchorEl,
  onClose,
  field,
  column,
  filters,
  onFilterChange,
}: FilterPopoverProps<T>) {
  const [tempFilters, setTempFilters] = useState(filters);
  const [newFilter, setNewFilter] = useState<{
    type: FilterOperationType;
    value: string;
  }>({ type: FilterOperationType.Eq, value: "" });

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleAddFilter = () => {
    if (newFilter.type && newFilter.value) {
      setTempFilters((prev) => [...prev, newFilter]);
      setNewFilter({ type: FilterOperationType.Eq, value: "" });
    }
  };

  const handleRemoveFilter = (index: number) => {
    setTempFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    if (field) {
      onFilterChange(field, tempFilters);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempFilters(filters);
    onClose();
  };

  const handleNewFilterChange = (
    type: keyof typeof newFilter,
    value: string
  ) => {
    setNewFilter((prev) => ({ ...prev, [type]: value }));
  };

  if (!field || !column) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        {/* Display applied filters as removable chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {tempFilters.map((filter, index) => (
            <Chip
              key={index}
              label={`${
                filterOperations[column.type].find(
                  (op) => op.value === filter.type
                )?.label || ""
              }: ${filter.value}`}
              onDelete={() => handleRemoveFilter(index)}
              color="primary"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        {/* New filter form */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Operation</InputLabel>
            <Select
              value={newFilter.type}
              onChange={(e) => handleNewFilterChange("type", e.target.value)}
              label="Operation"
            >
              {filterOperations[column.type].map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Value"
            value={newFilter.value}
            onChange={(e) => handleNewFilterChange("value", e.target.value)}
            type={column.type === "date" ? "date" : "text"}
          />
          <Button
            onClick={handleAddFilter}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Filter
          </Button>
        </Box>

        {/* CTA Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCancel} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleApply} variant="contained">
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
