"use client";

import {
  fetchPermissions,
  updatePermissions,
} from "@/apiService/accessControl";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import AlertComponent from "../../components/alerts/AlertComponent";
import { checkIsTenant } from "@/utils/isTenant";
interface AlertMessage {
  message: string;
  type: string;
}
interface Permission {
  resource: string;
  actions: string[];
  id: string;
}

const Permissions: React.FC = () => {
  const token: string | null = useSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedActions, setSelectedActions] = useState<{
    [key: string]: string[];
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const isTenant = checkIsTenant(); // Check if the user is a tenant

  useEffect(() => {
    const getPermissions = async () => {
      try {
        if (!token) {
          throw new Error("Token is null");
        }
        const data = await fetchPermissions(token);
        setPermissions(data);
        // Initialize selectedActions with the actions that are already allowed
        const initialSelectedActions = data.reduce(
          (acc: { [key: string]: string[] }, permission: Permission) => {
            acc[permission.resource] = permission.actions || [];
            return acc;
          },
          {},
        );
        setSelectedActions(initialSelectedActions);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    if (token) {
      getPermissions();
    }
  }, [token]);

  const handleSelectAll = (resource: string) => {
    setSelectedActions((prevState) => {
      const isAllSelected = prevState[resource].length === 4;
      return {
        ...prevState,
        [resource]: isAllSelected ? [] : ["create", "read", "update", "delete"],
      };
    });
  };

  const handleActionChange = (resource: string, action: string) => {
    setSelectedActions((prevState) => {
      const isSelected = prevState[resource].includes(action);
      return {
        ...prevState,
        [resource]: isSelected
          ? prevState[resource].filter((act) => act !== action)
          : [...prevState[resource], action],
      };
    });
  };

  interface PermissionUpdatePayload {
    permissionId: string;
    updateData: {
      permissionOperations: string[];
    };
  }

  const preparePayload = (): PermissionUpdatePayload[] => {
    return Object.keys(selectedActions)
      .map((resource) => {
        const permission = permissions.find((p) => p.resource === resource);
        return {
          permissionId: permission ? permission.id : "",
          updateData: {
            permissionOperations: selectedActions[resource],
          },
        };
      })
      .filter((payload) => payload.permissionId); // Filter out any entries without an ID
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = preparePayload();
      if (payload.length > 0) {
        if (!token) {
          throw new Error("Token is null");
        }
        await updatePermissions(token, payload);
        setAlertMessage({
          message: "Permissions updated successfully",
          type: "success",
        });
      } else {
        setAlertMessage({
          message: "No permissions to update.",
          type: "error",
        });
      }
    } catch (error) {
      setAlertMessage({
        message: "Failed to update permissions. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="permissions-container">
      <Breadcrumb pageName="Permissions" />
      {alertMessage && (
        <AlertComponent
          message={alertMessage.message}
          isError={alertMessage.type == "success" ? false : true}
        />
      )}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <div className="overflow-x-auto border border-gray">
            <table className="min-w-full border-collapse bg-gray-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left"></th>
                  <th className="px-4 py-2 text-left">All</th>
                  <th className="px-4 py-2 text-center">Create</th>
                  <th className="px-4 py-2 text-center">Read</th>
                  <th className="px-4 py-2 text-center">Update</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission, index) => (
                  <tr
                    key={permission.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-2"}
                  >
                    <td className="px-4 py-2">
                      <label
                        htmlFor={`checkboxLabel_${permission.id}`}
                        className="mb-3 block flex cursor-pointer select-none text-sm font-medium text-black dark:text-white"
                      >
                        {permission.resource}
                      </label>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <label
                        htmlFor={`checkboxLabel_${permission.id}`}
                        className=" block flex cursor-pointer select-none text-sm font-medium text-black dark:text-white"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={`checkboxLabel_${permission.id}`}
                            className="sr-only"
                            checked={
                              selectedActions[permission.resource]?.length === 4
                            }
                            onChange={
                              () =>
                                !isTenant &&
                                handleSelectAll(permission.resource) // Disable for tenants
                            }
                            disabled={isTenant} // Disable checkbox for tenants
                          />
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                              selectedActions[permission.resource]?.length === 4
                                ? "border-primary bg-gray dark:bg-transparent"
                                : ""
                            }`}
                          >
                            <span
                              className={`opacity-0 ${selectedActions[permission.resource]?.length === 4 ? "!opacity-100" : ""}`}
                            >
                              <svg
                                width="11"
                                height="8"
                                viewBox="0 0 11 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
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
                      </label>
                    </td>
                    {["create", "read", "update", "delete"].map((action) => (
                      <td key={action} className="px-4 py-2 text-center">
                        <label
                          htmlFor={`checkbox_${permission.resource}_${action}`}
                          className="flex cursor-pointer select-none items-center justify-center"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              id={`checkbox_${permission.resource}_${action}`}
                              className="sr-only"
                              onChange={
                                () =>
                                  !isTenant &&
                                  handleActionChange(
                                    permission.resource,
                                    action,
                                  ) // Disable for tenants
                              }
                              checked={selectedActions[
                                permission.resource
                              ]?.includes(action)}
                              disabled={isTenant} // Disable checkbox for tenants
                            />
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                selectedActions[permission.resource]?.includes(
                                  action,
                                )
                                  ? "border-primary bg-gray dark:bg-transparent"
                                  : ""
                              }`}
                            >
                              <span
                                className={`opacity-0 ${
                                  selectedActions[
                                    permission.resource
                                  ]?.includes(action)
                                    ? "!opacity-100"
                                    : ""
                                }`}
                              >
                                <svg
                                  width="11"
                                  height="8"
                                  viewBox="0 0 11 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
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
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isTenant && ( // Hide save button for tenants
            <div className="flex justify-end pt-4">
              <button onClick={handleSave} className="btn" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Permissions;
