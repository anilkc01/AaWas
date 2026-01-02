const express = require("express");
const router = express.Router();

// Temporary in-memory storage (NO database)
let reportedProperties = [];

/*
--------------------------------------------------
1. USER REPORTS A PROPERTY
--------------------------------------------------
POST /report-property
*/
router.post("/report-property", (req, res) => {
  const { propertyId, reason, reportedBy } = req.body;

  if (!propertyId || !reason || !reportedBy) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newReport = {
    reportId: Date.now(),
    propertyId,
    reason,
    reportedBy,
    status: "Pending",
    reportedAt: new Date(),
  };

  reportedProperties.push(newReport);

  res.status(201).json({
    message: "Property reported successfully",
    report: newReport,
  });
});

/*
--------------------------------------------------
2. ADMIN VIEW ALL REPORTED PROPERTIES
--------------------------------------------------
GET /admin/reported-properties
*/
router.get("/admin/reported-properties", (req, res) => {
  res.status(200).json({
    totalReports: reportedProperties.length,
    reports: reportedProperties,
  });
});

/*
--------------------------------------------------
3. ADMIN RESOLVE A REPORT
--------------------------------------------------
PUT /admin/resolve-report/:reportId
*/
router.put("/admin/resolve-report/:reportId", (req, res) => {
  const { reportId } = req.params;

  const report = reportedProperties.find(
    (r) => r.reportId == reportId
  );

  if (!report) {
    return res.status(404).json({
      message: "Report not found",
    });
  }

  report.status = "Resolved";

  res.status(200).json({
    message: "Report resolved successfully",
    report,
  });
});

/*
--------------------------------------------------
4. ADMIN DELETE A REPORTED PROPERTY (OPTIONAL)
--------------------------------------------------
DELETE /admin/delete-report/:reportId
*/
router.delete("/admin/delete-report/:reportId", (req, res) => {
  const { reportId } = req.params;

  reportedProperties = reportedProperties.filter(
    (r) => r.reportId != reportId
  );

  res.status(200).json({
    message: "Report deleted successfully",
  });
});

module.exports = router;
