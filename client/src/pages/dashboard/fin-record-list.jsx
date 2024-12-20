import React, { useMemo, useState } from "react";
import { useFinancialRecords } from "../../contexts/fin-record-context";
import { useTable } from "react-table";

const EditableCell = ({ value: initialValue, row, column, updateRecord, editable }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => setValue(e.target.value);

    const onBlur = () => {
        setIsEditing(false);
        updateRecord(row.index, column.id, value);
    };

    return (
        <div onClick={() => editable && setIsEditing(true)} style={{cursor: editable ? "pointer" : "default"}}>
            {isEditing ? (
                <input
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoFocus
                    style={{ width: "100%" }}
                />
            ) : typeof value === "string" ? (
                value
            ) : (
                value.toString()
            )}
        </div>
    );
};

export const FinancialRecordList = () => {
    const { records } = useFinancialRecords();

    const updateRecord = (rowIndex, columnId, value) => {
        console.log(`Updated row ${rowIndex}, column ${columnId} with value:`, value);
        // Update logic to be implemented
    };

    const deleteRecord = (rowIndex) => {
        console.log(`Delete row ${rowIndex}`);
        // Delete logic to be implemented
    };

    const columns = useMemo(
        () => [
            {
                Header: "Description",
                accessor: "description",
                Cell: (props) => (
                    <EditableCell {...props} updateRecord={updateRecord} editable={true} />
                ),
            },
            {
                Header: "Amount",
                accessor: "amount",
                Cell: (props) => (
                    <EditableCell {...props} updateRecord={updateRecord} editable={true} />
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: (props) => (
                    <EditableCell {...props} updateRecord={updateRecord} editable={true} />
                ),
            },
            {
                Header: "Payment",
                accessor: "payment",
                Cell: (props) => (
                    <EditableCell {...props} updateRecord={updateRecord} editable={true} />
                ),
            },
            {
                Header: "Date",
                accessor: "date",
                Cell: (props) => (
                    <EditableCell {...props} updateRecord={updateRecord} editable={false} />
                ),
            },
            {
                Header: "Delete",
                id: "delete",
                Cell: ({ row }) => (
                    <button
                        onClick={() => deleteRecord(row.index)}
                        className="button"
                    >
                        Delete
                    </button>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: records,
    });

    return (
        <div className="table-container">
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()} key={column.id}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()} key={cell.column.id}>
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
