import { Parser } from "json2csv";

export const exportToCSV = async (data) => {
  const parser = new Parser({ fields: ["name", "address", "phone"] });
  return parser.parse(data);
};
