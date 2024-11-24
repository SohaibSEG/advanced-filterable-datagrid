import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface QueryStringDisplayProps {
  queryString: string;
}

export function QueryStringDisplay({ queryString }: QueryStringDisplayProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generated Query String:
      </Typography>
      <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
        <pre>{queryString}</pre>
      </Paper>
    </Box>
  );
}
