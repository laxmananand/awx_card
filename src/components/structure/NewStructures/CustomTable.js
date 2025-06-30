import React, { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  TablePagination,
} from "@mui/material";
import { PuffLoader } from "react-spinners";

export const CustomTable = ({
  columns = [],
  rows = [],
  className = "",
  style = {},
  maxHeight = 350,
  isLoading = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={2}
      className={`custom-table-wrapper ${className}`}
      style={{
        overflow: "hidden",
        width: "100%",
        borderRadius: 8,
        border: "1px solid lightgrey",
        ...style,
      }}
    >
      <TableContainer
        sx={{
          maxHeight,
          borderRadius: "0",
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            width: "100%",
            borderRadius: "0",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{
                    background: "lightgrey",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    textTransform: "uppercase",
                    borderBottom: "none",
                    ...(idx === 0 && { borderTopLeftRadius: "0" }),
                    ...(idx === columns.length - 1 && {
                      borderTopRightRadius: "0",
                    }),
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <div className="py-5 d-flex flex-column align-items-center gap-3">
                    <PuffLoader color="brown" size={40} />
                    <p className="fs-8 text-secondary fw-600">
                      Fetching data, please wait...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <div className="py-5">
                    <span className="text-muted fw-bold">
                      No records found.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  hover
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#f5f5f5",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || "left"}
                      sx={{
                        fontSize: "13px",
                        fontFamily: "inherit",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        fontWeight: 600,
                      }}
                    >
                      {row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid #e0e0e0",
          fontSize: "13px",
        }}
      />
    </Paper>
  );
};

export default CustomTable;
