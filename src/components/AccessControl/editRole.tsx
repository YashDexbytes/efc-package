"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchRoleById,
  editRoleById,
  fetchPermissions,
} from "@/apiService/accessControl";
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import AlertComponent from "../../components/alerts/AlertComponent";
interface AlertMessage {
  message: string;
  type: string;
}

interface Permission {
  resource: string;
  actions: string[];
  id: number;
}

interface Grant {
  id: number;
  resource: string;
  actions: string[];
}

interface Role {
  id: string;
  role: string;
  grants: Grant[];
  description: string;
}

const EditRolePage: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [newPermissions, setNewPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = useSelector((state: any) => state.auth.accessToken);
  const router = useRouter();
  const { id } = useParams();
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [roleDescription, setRoleDescription] = useState<string>("");

  useEffect(() => {
    const fetchRoleDetails = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const roleData = await fetchRoleById(id, token);
        const permissionsData = await fetchPermissions(token);
        setRole(roleData);
        setRoleDescription(roleData.description || "");
        setAvailablePermissions(permissionsData);
      } catch (error) {
        console.error("Failed to fetch role details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [id, token]);

  const handleCheckboxChange = (resource: string, action: string) => {
    if (!role) return;

    const updatedGrants = role.grants.map((grant) => {
      if (grant.resource === resource) {
        const isActionChecked = grant.actions.includes(action);

        if (isActionChecked) {
          return {
            ...grant,
            actions: grant.actions.filter((act) => act !== action),
          };
        } else {
          return {
            ...grant,
            actions: [...grant.actions, action],
          };
        }
      }
      return grant;
    });

    setRole({ ...role, grants: updatedGrants });
  };
  const handleAddPermission = () => {
    const filteredPermissions = availablePermissions.filter(
      (permission) => !role?.grants.some((grant) => grant.id === permission.id),
    );
    // Check if there are any filtered permissions available
    if (filteredPermissions.length === 0) {
      console.error("No available permissions to add.");
      return; // Exit if no permissions are available
    }

    setNewPermissions([
      ...newPermissions,
      { id: 0, resource: "", actions: [] },
    ]);
  };
  const filteredPermissions = availablePermissions.filter(
    (permission) => !role?.grants.some((grant) => grant.id === permission.id),
  );
  // ... existing code ...
  const handleRemove = (id: number) => {
    setNewPermissions((prevPermissions) =>
      prevPermissions.filter((perm) => perm.id !== id),
    );
  };

  const handleSelectPermission = (index: number, permissionId: number) => {
    const selectedPermission = availablePermissions.find(
      (p) => p.id === permissionId,
    );
    if (!selectedPermission) return;

    const updatedPermissions = [...newPermissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      id: selectedPermission.id,
      resource: selectedPermission.resource,
      actions: [],
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

  const handleRemoveGrant = (grantId: number) => {
    if (!role) return;

    const updatedGrants = role.grants.filter((grant) => grant.id !== grantId);

    setRole({ ...role, grants: updatedGrants });
  };

  const handleSave = async () => {
    if (!role) return;

    setSaving(true);
    try {
      // Convert new permissions into the same format as role.grants
      const formattedNewPermissions = newPermissions.map((permission) => ({
        id: permission.id,
        resource: permission.resource,
        actions: permission.actions,
      }));

      const updatedGrants = [...role.grants, ...formattedNewPermissions];
      const updatedRole = {
        ...role,
        roleName: role.role, // Change key from role to roleName
        roleDescription: roleDescription.trim(), // Change key from description to roleDescription
        grants: updatedGrants,
      };

      const roleResponse = await editRoleById(token, role.id, updatedRole);
      // localStorage.setItem(
      //   "alertData",
      //   JSON.stringify({
      //     message: roleResponse.message,
      //     type: roleResponse.code == 201 ? "success" : "error",
      //   }),
      // );
      setAlertMessage({
        message: roleResponse.message || "Role updated successfully",
        type: "success",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/roles");
      }, 2000);
    } catch (error) {
      // Set error alert message
      setAlertMessage({
        message: "Failed to update role. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="roles-container">
      <Breadcrumb pageName="Roles" />
      {alertMessage && (
        <AlertComponent
          message={alertMessage.message}
          isError={alertMessage.type == "success" ? false : true}
        />
      )}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <div className="container mx-auto p-4">
            {role && (
              <div>
                <div className="mb-2">
                  <div className="mb-4 flex justify-between">
                    <div className="w-1/4">
                      <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                        Role Name
                      </label>
                      <input
                        name="roleName"
                        id="roleName"
                        type="text"
                        value={role.role || ""}
                        onChange={(e) =>
                          setRole({ ...role, role: e.target.value })
                        }
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
                      <button
                        onClick={handleAddPermission}
                        className="btn mt-4"
                      >
                        Add Permission
                      </button>
                    </div>
                  </div>
                </div>
                {role.grants.map((grant) => {
                  const availablePermission = availablePermissions.find(
                    (permission) => permission.resource === grant.resource,
                  );

                  if (!availablePermission) return null;

                  return (
                    <div
                      key={grant.id}
                      className="mb-4 flex items-center justify-between"
                    >
                      <h3 className="w-1/4 font-semibold">{grant.resource}</h3>
                      <div className="flex w-3/4 items-center space-x-4">
                        {availablePermission.actions.map((action) => {
                          const isChecked = grant.actions.includes(action);
                          return (
                            <label
                              key={action}
                              className="ml-4 flex cursor-pointer items-center"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    handleCheckboxChange(grant.resource, action)
                                  }
                                  className="sr-only"
                                />
                                <div
                                  className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${isChecked ? "border-primary bg-gray dark:bg-transparent" : ""}`}
                                >
                                  <span
                                    className={`opacity-0 ${isChecked ? "!opacity-100" : ""}`}
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
                              <span>{action}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div
                        className="mr-5 flex h-6 w-6 max-w-[36px] items-center justify-center rounded bg-[#F87171]"
                        onClick={() => handleRemoveGrant(grant.id)}
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
                  );
                })}
                {newPermissions.map((perm, index) => (
                  <div
                    key={perm.id}
                    className="mb-4 flex items-center justify-between"
                  >
                    <select
                      value={perm.id}
                      onChange={(e) =>
                        handleSelectPermission(index, Number(e.target.value))
                      }
                      className="w-1/4 rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
                    >
                      <option value="">Select Permission</option>
                      {filteredPermissions.map((permission) => (
                        <option key={permission.id} value={permission.id}>
                          {permission.resource}
                        </option>
                      ))}
                    </select>
                    <div className="flex w-3/4 items-center space-x-4">
                      {availablePermissions
                        .find((p) => p.id === perm.id)
                        ?.actions.map((action) => (
                          <label
                            key={action}
                            className="ml-4 flex cursor-pointer items-center"
                          >
                            <input
                              type="checkbox"
                              checked={perm.actions.includes(action)}
                              onChange={() => handleSelectAction(index, action)}
                              className="sr-only"
                            />
                            <div
                              className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${perm.actions.includes(action) ? "border-primary bg-gray dark:bg-transparent" : ""}`}
                            >
                              <span
                                className={`opacity-0 ${perm.actions.includes(action) ? "!opacity-100" : ""}`}
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
                            <span>{action}</span>
                          </label>
                        ))}
                    </div>
                    <div
                      className="mr-5 flex h-6 w-6 max-w-[36px] cursor-pointer items-center justify-center rounded bg-[#F87171]"
                      onClick={() => handleRemove(perm.id)}
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
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || !role.role}
                    className={`btn ${saving || !role.role ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRolePage;
