"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function SalesPersonPage() {
    const { data: persons } = useMasterData("sales-person");

    return <MasterCrudPage
        domain="sales-person" 
        title="Sales Persons" 
        description="Manage sales personnel and reporting hierarchy" 
        idPrefix="SLP" 
        fields={[
            { key: "personName", label: "Person Name", type: "text", required: true },
            { key: "designationName", label: "Designation", type: "text" },
            { key: "salesContactPersonPhone", label: "Phone", type: "text" },
            { key: "salesPersonEmailAddres", label: "Email", type: "text" },
            { key: "reportingManagerName", label: "Reporting Manager", type: "text" },
            { key: "remarks", label: "Remarks", type: "textarea" },
            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
        ]} 
        initialData={persons || []}
        columns={[
            { key: "personName", label: "Name" }, 
            { key: "designationName", label: "Designation" }, 
            { key: "salesContactPersonPhone", label: "Phone" }, 
            { key: "reportingManagerName", label: "Manager" }, 
            { key: "statusMaster", label: "Status" },
        ]} 
    />;
}
