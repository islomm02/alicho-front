"use client"
import { Table } from "antd";

export default function MyTable({
  data,
  columns
}: {
  data: any[];
  columns: any
}) {


  return (
  <Table
    columns={columns}
    dataSource={data}
    rowKey="company_id"
    pagination={{ pageSize: 10 }}
  />
);

}
