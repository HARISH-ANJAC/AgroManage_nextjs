"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { formatTanzaniaPhone, cleanPhoneForStorage } from "@/lib/validation";

export default function SalesPersonPage() {
    const { data: persons } = useMasterData("sales-person");
    const { data: employees } = useMasterData("employees");

    const employeeOptions = employees?.map((e: any) => ({
        value: e.id,
        label: `${e.name} (${e.role})`
    })) || [];

    const salesPersonOverrides = {
        add: async (form: any, next: any) => {
            const payload = { ...form };
            if (payload.salesContactPersonPhone) payload.salesContactPersonPhone = cleanPhoneForStorage(payload.salesContactPersonPhone);
            return next(payload);
        },
        update: async (item: any, next: any) => {
            const payload = { ...item };
            if (payload.salesContactPersonPhone) payload.salesContactPersonPhone = cleanPhoneForStorage(payload.salesContactPersonPhone);
            return next(payload);
        },
        onFieldChange: (key: string, value: any, setFormData: any, form: any) => {
            if (key === "empId" && value) {
                const selectedEmp = employees?.find((e: any) => String(e.id) === String(value));
                if (selectedEmp) {
                    setFormData({
                        ...form,
                        empId: value,
                        personName: selectedEmp.name,
                        designationName: selectedEmp.role,
                        salesContactPersonPhone: formatTanzaniaPhone(selectedEmp.phone),
                        salesPersonEmailAddres: selectedEmp.email
                    });
                    return true;
                }
            }
            if (key === "salesContactPersonPhone") {
                setFormData((prev: any) => ({ ...prev, [key]: formatTanzaniaPhone(value) }));
                return true;
            }
            return false;
        }
    };

    return <MasterCrudPage
        domain="sales-person"
        title="Sales Persons"
        description="Manage sales personnel and reporting hierarchy"
        idPrefix="SLP"
        customStoreOverrides={salesPersonOverrides}
        fields={[
            { key: "empId", label: "Select Employee", type: "select", options: employeeOptions, required: true },
            { key: "personName", label: "Person Name", type: "text", required: true },
            { key: "designationName", label: "Designation", type: "text" },
            { key: "salesContactPersonPhone", label: "Phone", type: "text", formatter: formatTanzaniaPhone },
            { key: "salesPersonEmailAddres", label: "Email", type: "text" },
            { key: "reportingManagerName", label: "Reporting Manager", type: "text" },
            { key: "remarks", label: "Remarks", type: "textarea" },
            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
        ]}
        initialData={persons || []}
        columns={[
            { key: "personName", label: "Name" },
            { key: "designationName", label: "Designation" },
            { key: "salesContactPersonPhone", label: "Phone", render: (val) => formatTanzaniaPhone(val) },
            { key: "reportingManagerName", label: "Manager" },
            { key: "statusMaster", label: "Status" },
        ]}
    />;
}
