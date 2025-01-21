"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRole, fetchPermissions } from "@/apiService/accessControl";
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Select from "react-select";

interface Permission {
  resource: string;
  actions: string[];
  id: number;
}

const AddRolePage: React.FC = () => {
  const [roleName, setRoleName] = useState<string>("");
  const [roleDescription, setRoleDescription] = useState<string>(""); // New state for roleDescription
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [newPermissions, setNewPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = useSelector((state: any) => state.auth.accessToken);
  const router = useRouter();

  useEffect(() => {
    const fetchAvailablePermissions = async () => {
      try {
        const permissionsData = await fetchPermissions(token);
        setAvailablePermissions(permissionsData);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePermissions();
  }, [token]);

  const handleAddPermission = () => {
    setNewPermissions([
      ...newPermissions,
      { id: 0, resource: "", actions: [] }, // Set id to 0 initially
    ]);
  };

  const handleRemove = (id: number) => {
    setNewPermissions((prevPermissions) =>
      prevPermissions.filter((perm) => perm.id !== id),
    );
  };

  const handleSelectPermission = (index: number, resource: string) => {
    const updatedPermissions = [...newPermissions];
    const selectedPermission = availablePermissions.find(
      (perm) => perm.resource === resource,
    );
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      id: selectedPermission ? selectedPermission.id : 0,
      resource: resource,
      actions: [], // Reset actions when changing the resource
    };
    setNewPermissions(updatedPermissions);
  };

  const handleSelectAction = (index: number, action: string) => {
    const updatedPermissions = [...newPermissions];
    const currentActions = updatedPermissions[index].actions;

    if (currentActions.includes(action)) {
      updatedPermissions[index].actions = currentActions.filter(
        (act) => act !== action,
      );
    } else {
      updatedPermissions[index].actions = [...currentActions, action];
    }

    setNewPermissions(updatedPermissions);
  };

  const handleSave = async () => {
    if (!roleName || !roleDescription) return;

    setSaving(true);

    // Construct the payload
    const payload = {
      roleName: roleName.trim(),
      roleDescription: roleDescription.trim(),
      grants: newPermissions
        .filter((perm) => perm.id !== 0 && perm.actions.length > 0)
        .map((perm) => ({
          id: perm.id,
          actions: perm.actions,
        })),
    };

    try {
      //   Make the API call to create the role (replace with actual API call)
      const roleResponse = await createRole(token, payload);
      localStorage.setItem(
        "alertData",
        JSON.stringify({
          message: roleResponse.message,
          type: roleResponse.code == 201 ? "success" : "error",
        }),
      );
      router.push("/roles");
    } catch (error) {
      localStorage.setItem(
        "alertData",
        JSON.stringify({ message: "Add Role Failed", type: "error" }),
      );
      router.push("/roles");
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    setRoleName("");
    setRoleDescription("");
    setNewPermissions([]);
    router.push("/roles");
  };
  if (loading) {
    return <div></div>;
  }

  return (
    <div className="roles-container">
      <Breadcrumb pageName="Add Role" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <div className="container mx-auto">
            <div className="mb-4">
              <div className="mb-4 flex justify-between">
                <div className="w-1/4">
                  <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                    Role Name
                  </label>
                  <input
                    name="roleName"
                    id="roleName"
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-1/4">
                  <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                    Role Description
                  </label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="addPermission">
                  <button onClick={handleAddPermission} className="btn mt-4">
                    Add Permission
                  </button>
                </div>
              </div>
            </div>

            {newPermissions.map((permission, index) => (
              <div
                key={permission.id}
                className="mb-4 flex items-center justify-between"
              >
                <Select
                  id={`permissionSelect-${index}`}
                  options={availablePermissions.map((perm) => ({
                    value: perm.resource,
                    label: perm.resource,
                  }))} // Map available permissions to Select options
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleSelectPermission(index, selectedOption.value); // Update selected permission
                    }
                  }}
                  className="w-1/4"
                  classNamePrefix="select-dropdown"
                  placeholder="Select Permission"
                  isSearchable
                  value={
                    availablePermissions.find(
                      (perm) => perm.resource === permission.resource,
                    )
                      ? {
                          value: permission.resource,
                          label: permission.resource,
                        }
                      : null
                  } // Set the selected value for edit mode
                />
                <div className="flex w-3/4 items-center space-x-4">
                  {availablePermissions
                    .find((perm) => perm.resource === permission.resource)
                    ?.actions.map((action) => (
                      <label
                        key={action}
                        className="ml-4 flex cursor-pointer items-center"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={permission.actions.includes(action)}
                            onChange={() => handleSelectAction(index, action)}
                            className="sr-only"
                          />
                          <div
                            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${permission.actions.includes(action) && "border-primary bg-gray dark:bg-transparent"}`}
                          >
                            <span
                              className={`opacity-0 ${permission.actions.includes(action) && "!opacity-100"}`}
                            >
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/3000/svg"
                              >
                                <path
                                  d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                  fill="#3056D3"
                                  stroke="#3056D3"
                                  strokeWidth="0.4"
                                ></path>
                              </svg>
                            </span>
                          </div>
                        </div>
                        {action}
                      </label>
                    ))}
                </div>
                <div
                  className="mr-5 flex h-6 w-6 max-w-[36px] items-center justify-center rounded bg-[#F87171]"
                  onClick={() => handleRemove(permission.id)}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                      fill="#ffffff"
                      stroke="#ffffff"
                    ></path>
                  </svg>
                </div>
              </div>
            ))}
            <div className="pt-20px flex justify-end gap-4 border-t border-stroke dark:border-strokedark">
              <button
                onClick={handleSave}
                disabled={saving || !roleName || !roleDescription}
                className={`btn ${
                  saving || !roleName || !roleDescription
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRolePage;
