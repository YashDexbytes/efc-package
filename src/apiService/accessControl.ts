import { get, post, put, del } from "@/utils/apiCalls";

// API functions
export const fetchPermissions = async (token: string) => {
  try {
    const data = await get("/api/permissions/list", token);
    return data.data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};

export const updatePermissions = async (
  token: string,
  permissionsToUpdate: any,
) => {
  try {
    return await put(
      "/api/permissions/update-multiple",
      token,
      permissionsToUpdate,
    );
  } catch (error) {
    console.error("Error updating permissions:", error);
    throw error;
  }
};

export const fetchRoles = async (token: string) => {
  try {
    const data = await get("/api/roles/list", token);
    return data.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const fetchRoleById = async (id: string, token: string) => {
  try {
    const data = await get(`/api/roles/${id}`, token);
    return data.data;
  } catch (error) {
    console.error("Error fetching role:", error);
    throw error;
  }
};

export const editRoleById = async (token: string, id: string, data: any) => {
  try {
    return await put(`/api/roles/${id}`, token, data);
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRoleById = async (
  token: string,
  id: string,
  isDeleted: number,
) => {
  try {
    return await del(`/api/roles/${id}`, token, { isDeleted });
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

export const createRole = async (
  token: string,
  roleData: { roleName: string; grants: { actions: string[] }[] },
) => {
  try {
    return await post("/api/roles/create", token, roleData);
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};
