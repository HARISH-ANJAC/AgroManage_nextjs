"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData"; 

export default function StoresPage() {
  const { data: stores, isLoading: loadingStores } = useMasterData("stores");
  const { data: locations, isLoading: loadingLocations } = useMasterData("locations");

  if (loadingLocations || loadingStores) return <div className="p-8 text-center text-muted-foreground font-medium">Loading data...</div>;

  const locationOptions = locations.map((l: any) => ({ value: l.id, label: l.locationName }));

  return <MasterCrudPage
    domain="stores" title="Stores" description="Manage your stores" idPrefix="STR" fields={[
    { key: "storeName", label: "Store Name", type: "text", required: true },
    { key: "storeShortCode", label: "Short Code", type: "text" },
    { key: "storeShortName", label: "Short Name", type: "text" },
    { key: "locationId", label: "Location", type: "select", options: locationOptions }, 
    { key: "managerName", label: "Manager Name", type: "text" },
    { key: "emailAddress", label: "Email Address", type: "text" },
    { key: "ccEmailAddress", label: "CC Email Address", type: "text" },
    { key: "bccEmailAddress", label: "BCC Email Address", type: "text" },
    { key: "responseDirectorsName", label: "Response Directors Name", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] }, 
  ]} initialData={stores} 
  columns={[
    { key: "storeName", label: "Store" }, { key: "storeShortCode", label: "Code" }, { key: "locationName", label: "Location" }, { key: "managerName", label: "Manager" }, { key: "statusMaster", label: "Status" }, 
  ]} />;
}
