"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Field {
  id: string;
  attributeName: string;
  dataType: string;
  key: string;
}

const dataTypeOptions = [
  "VARCHAR",
  "INT",
  "DECIMAL",
  "DATE",
  "DATETIME",
  "BOOLEAN",
  "TEXT",
];

const keyOptions = ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NONE"];

const ManageEntities = () => {
  const [showForm, setShowForm] = useState(false);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      attributeName: "id",
      dataType: "INT",
      key: "PRIMARY KEY",
    },
  ]);

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      attributeName: "",
      dataType: "VARCHAR",
      key: "NONE",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    if (id === "1") return; // Prevent removing the ID field
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, field: Partial<Field>) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
    );
  };

  const handleSubmit = () => {
    // Handle table creation logic here
    console.log({ tableName, fields });
    setShowForm(false);
    setTableName("");
    setFields([
      {
        id: "1",
        attributeName: "id",
        dataType: "INT",
        key: "PRIMARY KEY",
      },
    ]);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto p-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Create New Table
          </button>
        ) : (
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Create New Table</h2>
            
            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">
                Table Name
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter table name"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">Fields</label>
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="mb-3 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={field.attributeName}
                    onChange={(e) =>
                      updateField(field.id, { attributeName: e.target.value })
                    }
                    placeholder="Attribute name"
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={field.id === "1"}
                  />
                  <select
                    value={field.dataType}
                    onChange={(e) =>
                      updateField(field.id, { dataType: e.target.value })
                    }
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={field.id === "1"}
                  >
                    {dataTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={field.key}
                    onChange={(e) =>
                      updateField(field.id, { key: e.target.value })
                    }
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={field.id === "1"}
                  >
                    {keyOptions.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  {field.id !== "1" && (
                    <button
                      onClick={() => removeField(field.id)}
                      className="rounded bg-danger p-2 text-white hover:bg-opacity-90"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addField}
                className="mt-2 rounded bg-success px-4 py-2 text-white hover:bg-opacity-90"
              >
                Add Field
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setTableName("");
                  setFields([
                    {
                      id: "1",
                      attributeName: "id",
                      dataType: "INT",
                      key: "PRIMARY KEY",
                    },
                  ]);
                }}
                className="rounded border-[1.5px] border-stroke px-4 py-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
              >
                Create Table
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ManageEntities;
