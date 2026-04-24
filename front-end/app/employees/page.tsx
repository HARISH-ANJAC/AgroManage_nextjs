"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { formatTanzaniaPhone, cleanPhoneForStorage, enforceEmployeeValidation } from "@/lib/validation";

export default function EmployeesPage() {
  const { data: departments } = useMasterData("departments");
  const departmentOptions = departments?.map((d: any) => ({ value: d.id, label: d.departmentName })) || [];

  const employeeOverrides = {
    add: async (form: any, next: any) => {
      enforceEmployeeValidation(form);
      const payload = { ...form };
      if (payload.phone) payload.phone = cleanPhoneForStorage(payload.phone);
      return next(payload);
    },
    update: async (item: any, next: any) => {
      enforceEmployeeValidation(item);
      const payload = { ...item };
      if (payload.phone) payload.phone = cleanPhoneForStorage(payload.phone);
      return next(payload);
    },
    onFieldChange: (key: string, value: any, setFormData: any) => {
      if (key === "phone") {
        setFormData((prev: any) => ({ ...prev, [key]: formatTanzaniaPhone(value) }));
        return true;
      }
      return false;
    }
  };

  return <MasterCrudPage
    domain="employees" title="Employees" description="Manage your employees" idPrefix="EMP"
    customStoreOverrides={employeeOverrides}
    fields={[
      { key: "cardId", label: "Card ID", type: "text" },
      { key: "name", label: "Full Name", type: "text", required: true },
      { key: "role", label: "Role / Designation", type: "text" },
      { key: "department", label: "Department", type: "select", options: departmentOptions },
      { key: "phone", label: "Phone", type: "text", formatter: formatTanzaniaPhone },
      { key: "email", label: "Email", type: "text" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={[]} columns={[
      { key: "cardId", label: "Card ID" }, { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "departmentName", label: "Dept" }, { key: "phone", label: "Phone", render: (val) => formatTanzaniaPhone(val) }, { key: "statusMaster", label: "Status" },
    ]} />;
}

