// utils/exportToExcel.ts
import * as XLSX from "xlsx";

export const exportToExcel = (jsonData: any[], fileName = "places") => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
