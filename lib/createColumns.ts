import { ColumnDef } from "@tanstack/react-table";
import { JSX } from "react";

export const createColumns = <T extends object>(
    headers?: Partial<Record<keyof T, string>>,
    renderActions?: (row: T) => JSX.Element
): ColumnDef<T>[] => {
    const columns: ColumnDef<T>[] = (Object.keys(headers ?? {}) as Array<keyof T>).map((key) => ({
        accessorKey: key as string,
        header: headers?.[key] ?? key.toString(),
    }));

    if (renderActions) {
        columns.push({
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => renderActions(row.original),
        });
    }

    return columns;
};
