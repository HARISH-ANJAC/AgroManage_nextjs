"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function UserStoreMappingPage() {
  const { data: mappings, isLoading: loadingMappings } = useMasterData("user-store-mappings");
  const { data: users } = useMasterData("users");
  const { data: companies } = useMasterData("companies");
  const { data: stores } = useMasterData("stores");
  const { data: roles } = useMasterData("roles");

  const userOptions = users?.map((u: any) => ({ value: u.id, label: u.loginName })) || [];
  const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
  const storeOptions = stores?.map((s: any) => ({ value: s.id, label: s.storeName })) || [];
  const roleOptions = roles?.map((r: any) => ({ value: r.id, label: r.roleName })) || [];

  return <MasterCrudPage
    domain="user-store-mappings" title="User-Store Mapping" description="Manage your user to store mappings" idPrefix="USM" fields={[
      { key: "userIdUserToRole", label: "User", type: "select", required: true, options: userOptions },
      { key: "companyId", label: "Company", type: "select", options: companyOptions },
      { key: "storeIdUserToRole", label: "Store", type: "select", required: true, options: storeOptions },
      { key: "roleIdUserToRole", label: "Role", type: "select", options: roleOptions },
      { key: "statusUserToRole", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
    ]} initialData={mappings || []} columns={[
      { key: "userLoginName", label: "User" }, { key: "companyCompanyName", label: "Company" }, { key: "storeStoreName", label: "Store" }, { key: "roleRoleName", label: "Role" }, { key: "statusUserToRole", label: "Status" },
    ]} />;
}
