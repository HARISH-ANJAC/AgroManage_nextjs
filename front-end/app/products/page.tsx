"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";

export default function ProductsPage() {
  const { data: categories, isLoading: loadingCats } = useMasterData("categories");
  const { data: subcategories, isLoading: loadingSubs } = useMasterData("subcategories");
  const { data: uoms, isLoading: loadingUoms } = useMasterData("uom");

  if (loadingCats || loadingSubs || loadingUoms) return <div className="p-8 text-center text-muted-foreground font-medium">Loading catalog metadata...</div>;

  const categoryOptions = categories.map((c: any) => ({ value: c.id, label: c.mainCategoryName }));
  const subcategoryOptions = subcategories.map((s: any) => ({ value: s.id, label: s.subCategoryName }));
  const uomOptions = uoms.map((u: any) => ({ value: u.uomShortCode, label: `${u.uomName} (${u.uomShortCode})` }));

  return <MasterCrudPage
    domain="products"
    title="Products Catalog"
    description="Manage your agricultural products and global inventory catalog"
    idPrefix="PRD"
    fields={[
      { key: "productName", label: "Product Name", type: "text", required: true },
      { 
        key: "mainCategoryId", 
        label: "Main Category", 
        type: "select", 
        required: true, 
        options: categoryOptions 
      },
      { 
        key: "subCategoryId", 
        label: "Sub Category", 
        type: "select", 
        required: true, 
        options: subcategoryOptions 
      },
      { 
        key: "uom", 
        label: "Unit of Measure (UOM)", 
        type: "select", 
        required: true, 
        options: uomOptions 
      },
      { key: "qtyPerPacking", label: "Qty Per Packing", type: "number" },
      { 
        key: "alternateUom", 
        label: "Alternate UOM", 
        type: "select", 
        options: uomOptions 
      },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
    ]}
    initialData={[]}
    columns={[
      { key: "productName", label: "Product Name" },
      { key: "mainCategoryName", label: "Main Category" },
      { key: "subCategoryName", label: "Sub Category" },
      { key: "uom", label: "UOM" },
      { key: "qtyPerPacking", label: "Qty/Pack" },
      { key: "alternateUom", label: "Alt UOM" },
      { key: "statusMaster", label: "Status" },
    ]}
  />;
}
