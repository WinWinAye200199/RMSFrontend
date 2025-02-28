import { Table, TableProps } from "antd";

interface AntdTableProps<T> extends TableProps<T> {
    columns: TableProps<T>['columns'],
    dataSource: TableProps<T>['dataSource'],
}

export function AntdTable<T>({
    columns,
    dataSource,
    ...props
}: AntdTableProps<T>) {
    return (
        <Table
            rowKey={'id'}
            {...props}
            columns={columns}
            dataSource={dataSource}
            rowHoverable={false}
            bordered
            size="middle"
            pagination={{
                size: 'default',
                showSizeChanger: false,
                pageSize: 10,
            }}
            rootClassName="[&>.ant-spin-nested-loading>.ant-spin-container>.ant-table]:!bg-swamp-foreground"
        />
    )
}
