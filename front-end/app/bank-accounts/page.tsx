"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function BankAccountsPage() {
  const { data: bankAccounts, isLoading: loadingBankAccounts } = useMasterData("company-bank-accounts");
  const { data: companies } = useMasterData("companies");
  const { data: banks } = useMasterData("banks");
  const { data: currencies } = useMasterData("currencies");

  const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
  const bankOptions = banks?.map((b: any) => ({ value: b.id, label: b.bankName })) || [];
  const currencyOptions = currencies?.map((c: any) => ({ value: c.id, label: c.currencyName })) || [];

  return <MasterCrudPage
    domain="company-bank-accounts" title="Company Bank Accounts" description="Manage your bank accounts" idPrefix="CBA" fields={[
      { key: "companyId", label: "Company", type: "select", options: companyOptions },
      { key: "bankId", label: "Bank", type: "select", required: true, options: bankOptions },
      { key: "accountName", label: "Account Name", type: "text", required: true },
      { key: "accountNumber", label: "Account Number", type: "text", required: true },
      { key: "swiftCode", label: "Swift Code", type: "text" },
      { key: "branchAddress", label: "Branch Address", type: "text" },
      { key: "bankBranchName", label: "Bank Branch Name", type: "text" },
      { key: "currencyId", label: "Currency", type: "select", options: currencyOptions },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" }
    ]} initialData={bankAccounts || []} columns={[
      { key: "bankName", label: "Bank" }, { key: "accountName", label: "Account Name" }, { key: "accountNumber", label: "Account No" }, { key: "swiftCode", label: "Swift" }, { key: "currencyName", label: "Currency" }, { key: "statusMaster", label: "Status" },
    ]} />;
}
