"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function DepartmentsPage() {
    const { data: departments, isLoading } = useMasterData("departments");

    if (isLoading) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

    return (
        <MasterCrudPage
            domain="departments"
            title="Departments"
            description="Manage your organization's departments"
            idPrefix="DPT"
            fields={[
                { key: "departmentName", label: "Department Name", type: "text", required: true },
                { key: "departmentDescription", label: "Description", type: "text" },
                { key: "remarks", label: "Remarks", type: "textarea" },
                { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
            ]}
            initialData={departments || []}
            columns={[
                { key: "departmentName", label: "Name" },
                { key: "departmentDescription", label: "Description" },
                { key: "statusMaster", label: "Status" },
            ]}
        />
    );
}
