"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { formatTanzaniaPhone, cleanPhoneForStorage } from "@/lib/validation";

export default function UsersPage() {
  const { data: users, isLoading: loadingUsers } = useMasterData("users");

  const userOverrides = {
    add: async (form: any, next: any) => {
      const payload = { ...form };
      if (payload.mobileNoUserHdr) payload.mobileNoUserHdr = cleanPhoneForStorage(payload.mobileNoUserHdr);
      return next(payload);
    },
    update: async (item: any, next: any) => {
      const payload = { ...item };
      if (payload.mobileNoUserHdr) payload.mobileNoUserHdr = cleanPhoneForStorage(payload.mobileNoUserHdr);
      return next(payload);
    },
    onFieldChange: (key: string, value: any, setFormData: any) => {
      if (key === "mobileNoUserHdr") {
        setFormData((prev: any) => ({ ...prev, [key]: formatTanzaniaPhone(value) }));
        return true;
      }
      return false;
    }
  };

  return <MasterCrudPage
    domain="users" title="Users" description="Manage your users" idPrefix="USR"
    customStoreOverrides={userOverrides}
    fields={[
      { key: "loginName", label: "Login Name", type: "text", required: true },
      { key: "passwordUserHdr", label: "Password", type: "password", required: false, placeholder: "Default: [name]123" },
      { key: "roleUserHdr", label: "Role", type: "select", options: ["Super Admin", "Manager", "User", "Viewer"] },
      { key: "mobileNoUserHdr", label: "Mobile No", type: "text", formatter: formatTanzaniaPhone },
      { key: "mailIdUserHdr", label: "Email", type: "text" },
      { key: "stockShowStatus", label: "Stock Show Status", type: "select", options: ["Y", "N"] },
      { key: "outsideAccessYN", label: "Outside Access", type: "select", options: ["Y", "N"] },
      { key: "remarksUserHdr", label: "Remarks", type: "textarea" },
      { key: "statusUserHdr", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={users} columns={[
      { key: "loginName", label: "Login" }, 
      { key: "roleUserHdr", label: "Role" }, 
      { key: "mobileNoUserHdr", label: "Mobile", render: (val) => formatTanzaniaPhone(val) }, 
      { key: "mailIdUserHdr", label: "Email" }, 
      { key: "statusUserHdr", label: "Status" },
    ]} />;
}
