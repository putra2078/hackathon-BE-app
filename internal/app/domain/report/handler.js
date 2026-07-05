const service = require("./service");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await service.getSalesReport(startDate, endDate);
    res.json({ data: report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await service.getAnalytics(startDate, endDate);
    res.json({ data: analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpensesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await service.getExpensesReport(startDate, endDate);
    res.json({ data: expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfitReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const profit = await service.getProfitReport(startDate, endDate);
    res.json({ data: profit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportReport = async (req, res) => {
  try {
    const { type, reportType, startDate, endDate } = req.query;
    let data;
    if (reportType === "sales") data = await service.getSalesReport(startDate, endDate);
    else if (reportType === "expenses") data = await service.getExpensesReport(startDate, endDate);
    else return res.status(400).json({ error: "Invalid report type" });

    if (type === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment(`${reportType}_report.csv`);
      return res.send(csv);
    } else if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");
      
      // Simple implementation assuming flat data structure
      if (data.length > 0) {
        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key: key }));
        worksheet.addRows(data);
      }

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=${reportType}_report.xlsx`);
      await workbook.xlsx.write(res);
      return res.end();
    } else {
      res.status(400).json({ error: "Invalid export type" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSalesReport,
  getAnalytics,
  getExpensesReport,
  getProfitReport,
  exportReport
};
