"use client";

import React, { useEffect, useState } from "react";
import { fetchRoles, deleteRoleById } from "@/apiService/accessControl";
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import ConfirmationModal from "../../components/alerts/confirmationModel";
import NotificationModal from "../../components/alerts/notificationModel";
import AlertComponent from "../../components/alerts/AlertComponent";
import Loader from "../../components/common/Loader";
interface Role {
  roleId: string;
  role: string;
}
interface AlertMessage {
  message: string;
  type: string;
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const token = useSelector((state: any) => state.auth.accessToken); // Adjust to your Redux structure
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const data = await fetchRoles(token);
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };
    const alertData = localStorage.getItem("alertData");
    if (alertData) {
      setAlertMessage(JSON.parse(alertData));
      localStorage.removeItem("alertData");
    }

    fetchAllRoles();
  }, [token]);

  const handleEdit = (id: string) => {
    router.push(`/roles/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedRoleId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRoleId) {
      try {
        const deleteResponse = await deleteRoleById(token, selectedRoleId, 1);

        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.roleId !== selectedRoleId),
        );
        setAlertMessage({ message: deleteResponse.message, type: "success" });
        setIsError(false);
      } catch (error) {
        setAlertMessage({ message: "Failed to delete role", type: "error" });
        setIsError(true);
      } finally {
        setIsModalOpen(false);
        setSelectedRoleId(null);
        // setIsNotificationOpen(true); // Open the notification modal
      }
    }
  };

  const handleCreateRole = () => {
    router.push("/roles/addRole");
  };

  const rows = roles.map((role) => ({
    id: role.roleId,
    name: role.role,
  }));

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
      disableColumnMenu: true,
      resizable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      type: "actions",
      disableColumnMenu: true,
      resizable: false,
      filterable: false,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          onClick={() => handleEdit(params.row.id)}
          label="Edit"
          showInMenu
          style={{ color: "#077fc8" }}
        />,
        <GridActionsCellItem
          key="delete"
          onClick={() => handleDelete(params.row.id)}
          label="Delete"
          showInMenu
          style={{ color: "#077fc8" }}
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="roles-container">
      <div className="flex items-center justify-between">
        <Breadcrumb pageName="Roles" />
        <div className="flex items-center space-x-4">
          <button onClick={handleCreateRole} className="btn">
            Add New
          </button>
        </div>
      </div>
      {alertMessage && (
        <AlertComponent
          message={alertMessage.message}
          isError={alertMessage.type == "success" ? false : true}
        />
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="table-data-grid p-6.5">
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            isRowSelectable={() => false} // Disable row selection
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50, 100, 500]}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this role?"
        title="Delete Role"
      />
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        isError={isError}
      />
    </div>
  );
};

export default RolesPage;
