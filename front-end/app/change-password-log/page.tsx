"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function PasswordLogsPage() {
    const { data: logs } = useMasterData("password-logs");
    const { data: users } = useMasterData("users");

    const userOptions = users?.map((u: any) => ({ value: u.id, label: u.loginName })) || [];

    return <MasterCrudPage
        domain="password-logs" 
        title="Change Password Logs" 
        description="View and manage the password change history for all users" 
        idPrefix="CPL" 
        fields={[
            { key: "loginId", label: "User", type: "select", required: true, options: userOptions },
            { key: "userName", label: "Display Name", type: "text" },
            { key: "oldPassword", label: "Old Password", type: "text" },
            { key: "newPassword", label: "New Password", type: "text" },
            { key: "reason", label: "Reason", type: "textarea" },
            { key: "statusEntry", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
        ]} 
        initialData={logs || []}
        columns={[
            { key: "userLoginName", label: "User" }, 
            { key: "oldPassword", label: "Old Pass" }, 
            { key: "newPassword", label: "New Pass" }, 
            { key: "reason", label: "Reason" }, 
            { key: "statusEntry", label: "Status" },
        ]} 
    />;
}
