"use client";

import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BillingLocationsPage() {
    // Basic Data
    const billingLocationsMaster = useMasterData("billing-locations");
    const { data: billingLocations } = billingLocationsMaster;

    // Pricing Data
    const pricingMaster = useMasterData("billing-location-pricing");
    const { data: pricing } = pricingMaster;

    // Other related data
    const { data: products } = useMasterData("products");
    const { data: categories } = useMasterData("categories");
    const { data: subCategories } = useMasterData("sub-categories");

    // Options mapping
    const billingLocationOptions = billingLocations?.map((l: any) => ({ 
        value: l.id, 
        label: l.billingLocationName 
    })) || [];
    
    const productOptions = products?.map((p: any) => ({ 
        value: p.id, 
        label: p.productName 
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-foreground">Billing Locations Management</h1>
                <p className="text-sm text-muted-foreground">Manage your billing locations and their specific product pricing rules.</p>
            </div>

            <Tabs defaultValue="locations" className="w-full">
                <div className="overflow-x-auto pb-2 border-b">
                    <TabsList className="bg-transparent p-0 gap-6">
                        <TabsTrigger 
                            value="locations" 
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2"
                        >
                            Locations Master
                        </TabsTrigger>
                        <TabsTrigger 
                            value="pricing" 
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2"
                        >
                            Location-wise Pricing
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="locations" className="mt-6">
                    <MasterCrudPage
                        domain="billing-locations"
                        title="Billing Locations"
                        description="Manage your primary billing locations and delivery zones"
                        idPrefix="BLO"
                        fields={[
                            { key: "billingLocationName", label: "Billing Location Name", type: "text", required: true },
                            { key: "billingLocationDescription", label: "Description", type: "text" },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
                        ]}
                        initialData={billingLocations || []}
                        columns={[
                            { key: "billingLocationName", label: "Location Name" },
                            { key: "billingLocationDescription", label: "Description" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="pricing" className="mt-6">
                    <MasterCrudPage
                        domain="billing-location-pricing"
                        title="Location Pricing"
                        description="Define special product prices for specific billing locations"
                        idPrefix="BLP"
                        fields={[
                            { key: "billingLocationId", label: "Billing Location", type: "select", required: true, options: billingLocationOptions },
                            { key: "mainCategoryId", label: "Main Category", type: "select", options: categories?.map((c: any) => ({ value: c.id, label: c.mainCategoryName })) || [] },
                            {
                                key: "subCategoryId",
                                label: "Sub Category",
                                type: "select",
                                dependsOn: "mainCategoryId",
                                options: (form) => {
                                    if (!form.mainCategoryId) return [];
                                    return subCategories
                                        ?.filter((s: any) => String(s.mainCategoryId) === String(form.mainCategoryId))
                                        ?.map((s: any) => ({ value: s.id, label: s.subCategoryName })) || [];
                                }
                            },
                            {
                                key: "productId",
                                label: "Product",
                                type: "select",
                                required: true,
                                dependsOn: "subCategoryId",
                                options: (form) => {
                                    if (!form.subCategoryId) return [];
                                    return products
                                        ?.filter((p: any) => String(p.subCategoryId) === String(form.subCategoryId))
                                        ?.map((p: any) => ({ value: p.id, label: p.productName })) || [];
                                }
                            },
                            { key: "unitPrice", label: "Unit Price", type: "number", required: true },
                            { key: "effectiveFrom", label: "Effective From", type: "date" },
                            { key: "effectiveTo", label: "Effective To", type: "date" },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"], defaultValue: "Active" },
                        ]}
                        initialData={pricing || []}
                        columns={[
                            { 
                                key: "billingLocationId", 
                                label: "Location",
                                render: (val) => billingLocations?.find((l: any) => String(l.id) === String(val))?.billingLocationName || val 
                            },
                            { 
                                key: "productId", 
                                label: "Product",
                                render: (val) => products?.find((p: any) => String(p.id) === String(val))?.productName || val 
                            },
                            { key: "unitPrice", label: "Price" },
                            { key: "statusMaster", label: "Status" },
                        ]}

                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
