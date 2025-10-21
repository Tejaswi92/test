import React, { useState } from "react";

// Single-file React component that renders an editable UI for the provided JSON structure.
// - Tailwind CSS classes are used for styling (no imports required in this file).
// - The component provides sections for bucket, source/target configs, processing cases, and testcase config.
// - Users can edit fields, add/remove array items, validate basic required fields, and download the modified JSON.

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
  const [mode, setMode] = useState("form"); // form | raw

  // Generic updater for top-level keys and nested paths (dot-separated)
  function updateAtPath(path, value) {
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
  }

  function handleRawApply() {
    try {
      const parsed = JSON.parse(jsonText);
      setData(parsed);
      setMode("form");
    } catch (e) {
      alert("Invalid JSON: " + e.message);
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Helpers for arrays inside the object (add/remove)
  function addTestPlan() {
    setData((d) => {
      const copy = JSON.parse(JSON.stringify(d));
      copy.testcaseconfig_config_new.execution.test_plan.push({ status: ["TO DO"], summary: "New Plan", test_plan_id: "" });
      setJsonText(JSON.stringify(copy, null, 2));
      return copy;
    });
  }

  function removeTestPlan(idx) {
    setData((d) => {
      const copy = JSON.parse(JSON.stringify(d));
      copy.testcaseconfig_config_new.execution.test_plan.splice(idx, 1);
      setJsonText(JSON.stringify(copy, null, 2));
      return copy;
    });
  }

  function addTestcase() {
    setData((d) => {
      const copy = JSON.parse(JSON.stringify(d));
      copy.testcaseconfig_config_new.testcases.push({ config_data: {}, test_case_id: "" });
      setJsonText(JSON.stringify(copy, null, 2));
      return copy;
    });
  }

  function removeTestcase(idx) {
    setData((d) => {
      const copy = JSON.parse(JSON.stringify(d));
      copy.testcaseconfig_config_new.testcases.splice(idx, 1);
      setJsonText(JSON.stringify(copy, null, 2));
      return copy;
    });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">GSS JSON Editor</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { setMode(mode === "form" ? "raw" : "form"); setJsonText(JSON.stringify(data, null, 2)); }}
              className="px-3 py-1 rounded bg-white border"
            >
              {mode === "form" ? "Edit raw JSON" : "Back to form"}
            </button>
            <button onClick={downloadJson} className="px-3 py-1 rounded bg-blue-600 text-white">Download JSON</button>
          </div>
        </header>

        {mode === "raw" ? (
          <div>
            <p className="mb-2 text-sm text-gray-600">Edit raw JSON and press <strong>Apply</strong>.</p>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={20}
              className="w-full font-mono p-4 border rounded bg-white"
            />
            <div className="mt-2 flex gap-2">
              <button onClick={handleRawApply} className="px-3 py-1 rounded bg-green-600 text-white">Apply</button>
              <button onClick={() => setJsonText(JSON.stringify(data, null, 2))} className="px-3 py-1 rounded border bg-white">Reset</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-lg font-medium mb-2">General</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm text-gray-600">Bucket Name</div>
                  <input value={data.bucket_name || ''} onChange={(e) => updateAtPath('bucket_name', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>

                <label className="block">
                  <div className="text-sm text-gray-600">Results Prefix</div>
                  <input value={data.results_prefix || ''} onChange={(e) => updateAtPath('results_prefix', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>

                <label className="block">
                  <div className="text-sm text-gray-600">JIRA Updation</div>
                  <input value={data.jira_updation || ''} onChange={(e) => updateAtPath('jira_updation', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>

                <label className="block">
                  <div className="text-sm text-gray-600">JIRA Defect Creation</div>
                  <input value={data.jira_defect_creation || ''} onChange={(e) => updateAtPath('jira_defect_creation', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
              </div>
            </section>

            <section className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-lg font-medium mb-2">Input File Config: sources_and_targets</h2>
              <div className="grid grid-cols-2 gap-4">
                {['source','target'].map((which) => (
                  <div key={which} className="p-3 border rounded">
                    <h3 className="font-medium capitalize mb-2">{which}</h3>
                    <label className="block text-sm mb-1">Path
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.path || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.path`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Type
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.type || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.type`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Format
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.format || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.format`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Delimiter
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.delimiter || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.delimiter`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Composite Keys
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.compositekeys || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.compositekeys`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Matching Cols
                      <input value={data.inputfileconfig?.sources_and_targets?.[which]?.matchingcols || ''} onChange={(e) => updateAtPath(`inputfileconfig.sources_and_targets.${which}.matchingcols`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-1">Processing Case
                  <input value={data.inputfileconfig?.sources_and_targets?.processing_case || ''} onChange={(e) => updateAtPath('inputfileconfig.sources_and_targets.processing_case', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
              </div>
            </section>

            <section className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-lg font-medium mb-2">Top-level Source / Target</h2>
              <div className="grid grid-cols-2 gap-4">
                {['source','target'].map((which) => (
                  <div key={which} className="p-3 border rounded">
                    <h3 className="font-medium capitalize mb-2">{which}</h3>
                    <label className="block text-sm mb-1">Path
                      <input value={data[which]?.path || ''} onChange={(e) => updateAtPath(`${which}.path`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Type
                      <input value={data[which]?.type || ''} onChange={(e) => updateAtPath(`${which}.type`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Format
                      <input value={data[which]?.format || ''} onChange={(e) => updateAtPath(`${which}.format`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Delimiter
                      <input value={data[which]?.delimiter || ''} onChange={(e) => updateAtPath(`${which}.delimiter`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Composite Keys
                      <input value={data[which]?.compositekeys || ''} onChange={(e) => updateAtPath(`${which}.compositekeys`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                    <label className="block text-sm mb-1">Matching Cols
                      <input value={data[which]?.matchingcols || ''} onChange={(e) => updateAtPath(`${which}.matchingcols`, e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-1">Processing Case (top-level)
                  <input value={data.processing_case || ''} onChange={(e) => updateAtPath('processing_case', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
              </div>
            </section>

            <section className="bg-white p-4 rounded shadow-sm">
              <h2 className="text-lg font-medium mb-2">Testcase Config</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm text-gray-600">Epic</div>
                  <input value={data.testcaseconfig_config_new.execution.epic || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.execution.epic', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
                <label className="block">
                  <div className="text-sm text-gray-600">Assignee</div>
                  <input value={data.testcaseconfig_config_new.execution.assignee || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.execution.assignee', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
                <label className="block">
                  <div className="text-sm text-gray-600">Priority</div>
                  <input value={data.testcaseconfig_config_new.execution.priority || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.execution.priority', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>

                <label className="block">
                  <div className="text-sm text-gray-600">Components</div>
                  <input value={data.testcaseconfig_config_new.execution.components || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.execution.components', e.target.value)} className="w-full p-2 border rounded mt-1" />
                </label>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Test Plans</h3>
                <div className="space-y-3">
                  {data.testcaseconfig_config_new.execution.test_plan.map((tp, idx) => (
                    <div key={idx} className="p-3 border rounded bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm">Summary</div>
                          <input value={tp.summary || ''} onChange={(e) => { const copy = JSON.parse(JSON.stringify(data)); copy.testcaseconfig_config_new.execution.test_plan[idx].summary = e.target.value; setData(copy); setJsonText(JSON.stringify(copy, null, 2)); }} className="p-2 border rounded w-full mt-1" />
                        </div>
                        <div className="ml-4 text-right">
                          <button onClick={() => removeTestPlan(idx)} className="px-2 py-1 rounded border">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button onClick={addTestPlan} className="px-3 py-1 rounded bg-green-600 text-white">Add test plan</button>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Testcases</h3>
                  <div className="space-y-3">
                    {data.testcaseconfig_config_new.testcases.map((tc, idx) => (
                      <div key={idx} className="p-3 border rounded bg-gray-50">
                        <div className="flex gap-2">
                          <input value={tc.test_case_id || ''} onChange={(e) => { const copy = JSON.parse(JSON.stringify(data)); copy.testcaseconfig_config_new.testcases[idx].test_case_id = e.target.value; setData(copy); setJsonText(JSON.stringify(copy, null, 2)); }} className="p-2 border rounded flex-1" />
                          <button onClick={() => removeTestcase(idx)} className="px-2 py-1 rounded border">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <button onClick={addTestcase} className="px-3 py-1 rounded bg-green-600 text-white">Add testcase</button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <label className="block">
                    <div className="text-sm text-gray-600">JIRA Secret Name</div>
                    <input value={data.testcaseconfig_config_new.JIRA_Secret_Name || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.JIRA_Secret_Name', e.target.value)} className="w-full p-2 border rounded mt-1" />
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-600">Payload filename</div>
                    <input value={data.testcaseconfig_config_new.payload_filename || ''} onChange={(e) => updateAtPath('testcaseconfig_config_new.payload_filename', e.target.value)} className="w-full p-2 border rounded mt-1" />
                  </label>
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-2">
              <button onClick={() => { setJsonText(JSON.stringify(data, null, 2)); }} className="px-3 py-1 rounded border bg-white">Sync Raw</button>
              <button onClick={downloadJson} className="px-3 py-1 rounded bg-blue-600 text-white">Download JSON</button>
            </div>
          </div>
        )}

        <footer className="mt-8 text-sm text-gray-500">Tip: toggle to raw mode for bulk edits. This UI is a single-file component — drop into a React app and ensure Tailwind is present for styling.</footer>
      </div>
    </div>
  );
}
