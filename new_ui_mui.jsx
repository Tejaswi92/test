import React, { useState } from "react";
import { Box, Grid, TextField, Typography, Button, Paper } from "@mui/material";
import Navbar from "../components/layouts/navbar";
import ReusablePaper from "../components/Paper/Paper";
import ReusableSnackbar from "../components/Snackbar/Snackbar";

export default function GssJsonEditor() {
  const initialData = {
    "bucket_name": "lly-gss",
    "inputfileconfig": {
      "sources_and_targets": {
        "source": {
          "path": "s3://test",
          "type": "s3",
          "format": "csv",
          "delimiter": ",",
          "compositekeys": "cand_id",
          "matchingcols": "cand_id"
        },
        "target": {
          "path": "s3://test",
          "type": "s3",
          "format": "csv",
          "delimiter": ",",
          "compositekeys": "cand_id",
          "matchingcols": "cand_id"
        },
        "processing_case": "General_Payment"
      }
    },
    "source": {
      "path": "s3://",
      "type": "s3",
      "format": "csv",
      "delimiter": ",",
      "compositekeys": "code",
      "matchingcols": "CODE"
    },
    "target": {
      "path": "s3",
      "type": "s3",
      "format": "csv",
      "delimiter": ",",
      "compositekeys": "code",
      "matchingcols": "CODE"
    },
    "processing_case": "International",
    "results_prefix": "DAD",
    "jira_updation": "Yes",
    "jira_defect_creation": "No",
    "testcaseconfig_config_new": {
      "execution": {
        "epic": "DEMOSCRUM-659",
        "assignee": "34343434523443",
        "priority": "highest",
        "test_plan": [
          {
            "status": ["TO DO"],
            "summary": "Demo Test Plan",
            "test_plan_id": "DEMOSCRUM-660"
          }
        ],
        "components": "Automation",
        "fixVersions": "Test",
        "project_name": "DEMOSCRUM",
        "affectversion": "",
        "qa_execution_key": "DEMOSCRUM-1181"
      },
      "testcases": [
        {
          "config_data": {},
          "test_case_id": "DEMOSCRUM-885"
        }
      ],
      "JIRA_Secret_Name": "gss_jira_secret",
      "payload_filename": "testcase_config.json"
    }
  };

  const [data, setData] = useState(initialData);
  const [jsonText, setJsonText] = useState(JSON.stringify(initialData, null, 2));
  const [mode, setMode] = useState("form");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const updateAtPath = (path, value) => {
    const keys = path.split(".");
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in cur)) cur[k] = {};
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = value;
      setJsonText(JSON.stringify(copy, null, 2));
      return copy;
    });
  };

  const handleRawApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setData(parsed);
      setMode("form");
      setSnackbar({ open: true, message: "JSON applied successfully!", severity: "success" });
    } catch (e) {
      setSnackbar({ open: true, message: "Invalid JSON: " + e.message, severity: "error" });
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: "JSON downloaded successfully", severity: "success" });
  };

  return (
    <Navbar>
      <Box sx={{ p: 3, backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>GSS JSON Editor</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
          <Button variant="outlined" onClick={() => setMode(mode === "form" ? "raw" : "form")}>
            {mode === "form" ? "Edit Raw JSON" : "Back to Form"}
          </Button>
          <Button variant="contained" onClick={downloadJson}>Download JSON</Button>
        </Box>

        {mode === "raw" ? (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Edit raw JSON and click Apply.</Typography>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={20}
              style={{ width: "100%", fontFamily: "monospace", padding: "10px" }}
            />
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={handleRawApply}>Apply</Button>
              <Button variant="outlined" onClick={() => setJsonText(JSON.stringify(data, null, 2))}>Reset</Button>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReusablePaper title="General">
                <Grid container spacing={2}>
                  {[
                    ["Bucket Name", "bucket_name"],
                    ["Results Prefix", "results_prefix"],
                    ["JIRA Updation", "jira_updation"],
                    ["JIRA Defect Creation", "jira_defect_creation"]
                  ].map(([label, key]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField fullWidth label={label} value={data[key] || ""}
                        onChange={(e) => updateAtPath(key, e.target.value)} variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </ReusablePaper>
            </Grid>

            <Grid item xs={12}>
              <ReusablePaper title="Testcase Configuration">
                <Typography variant="body2" sx={{ mb: 2 }}>Epic: {data.testcaseconfig_config_new.execution.epic}</Typography>
                <Button variant="contained" color="primary" onClick={() => setSnackbar({ open: true, message: "Configuration updated", severity: "info" })}>
                  Save Changes
                </Button>
              </ReusablePaper>
            </Grid>
          </Grid>
        )}

        <ReusableSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </Navbar>
  );
}
