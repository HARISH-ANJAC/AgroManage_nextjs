"use client";

import { useState } from "react";
import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomersPage() {
    // Basic Data
    const { data: customers } = useMasterData("customers");
    const { data: countries } = useMasterData("countries");
    const { data: regions } = useMasterData("regions");
    const { data: districts } = useMasterData("districts");
    const { data: currencies } = useMasterData("currencies");
    const { data: billingLocations } = useMasterData("billing-locations");

    // Sub-modules Data
    const { data: addresses } = useMasterData("customer-addresses");
    const { data: files } = useMasterData("customer-files");
    const { data: billingMappings } = useMasterData("customer-billing-mappings");
    const { data: vatSettings } = useMasterData("customer-vat-settings");
    const { data: prices } = useMasterData("customer-pricing");
    const { data: creditLimits } = useMasterData("customer-credit-limits");
    const { data: creditFiles } = useMasterData("credit-limit-files");

    // Other related data
    const { data: companies } = useMasterData("companies");
    const { data: products } = useMasterData("products");

    // Options mapping
    const customerOptions = customers?.map((c: any) => ({ value: c.id, label: c.customerName })) || [];
    const countryOptions = countries?.map((c: any) => ({ value: c.id, label: c.countryName })) || [];
    const regionOptions = regions?.map((r: any) => ({ value: r.id, label: r.regionName })) || [];
    const districtOptions = districts?.map((d: any) => ({ value: d.id, label: d.districtName })) || [];
    const currencyOptions = currencies?.map((c: any) => ({ value: c.id, label: c.currencyName })) || [];
    const billingLocationOptions = billingLocations?.map((b: any) => ({ value: b.id, label: b.billingLocationName })) || [];
    const companyOptions = companies?.map((c: any) => ({ value: c.id, label: c.companyName })) || [];
    const productOptions = products?.map((p: any) => ({ value: p.id, label: p.productName })) || [];
    const creditLimitOptions = creditLimits?.map((l: any) => ({ value: l.id, label: `Limit ${l.id} - ${l.customerCustomerName}` })) || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
            <p className="text-sm text-muted-foreground -mt-5">Centralized hub for managing customer profiles, locations, and financial configurations.</p>

            <Tabs defaultValue="general" className="w-full">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="general">General Info</TabsTrigger>
                        <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                        <TabsTrigger value="billing">Billing Locations</TabsTrigger>
                        <TabsTrigger value="vat">VAT Settings</TabsTrigger>
                        <TabsTrigger value="pricing">Product Pricing</TabsTrigger>
                        <TabsTrigger value="credit">Credit Limits</TabsTrigger>
                        <TabsTrigger value="credit-files">Credit Files</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="general" className="mt-4">
                    <MasterCrudPage
                        domain="customers"
                        title="Customers"
                        description="Manage your primary customer contact and business details"
                        idPrefix="CUS"
                        fields={[
                            { key: "customerName", label: "Customer Name", type: "text", required: true },
                            { key: "tinNumber", label: "TIN Number", type: "text", required: true },
                            { key: "vatNumber", label: "VAT Number", type: "text" },
                            { key: "contactPerson", label: "Contact Person", type: "text" },
                            { key: "contactNumber", label: "Contact Number", type: "text" },
                            { key: "phoneNumber2", label: "Phone Number 2", type: "text" },
                            { key: "emailAddress", label: "Email Address", type: "text" },
                            { key: "location", label: "Location", type: "text" },
                            { key: "natureOfBusiness", label: "Nature of Business", type: "text" },
                            { key: "billingLocationId", label: "Billing Location", type: "select", options: billingLocationOptions },
                            { key: "countryId", label: "Country", type: "select", options: countryOptions },
                            { key: "regionId", label: "Region", type: "select", options: regionOptions },
                            { key: "districtId", label: "District", type: "select", options: districtOptions },
                            { key: "currencyId", label: "Currency", type: "select", options: currencyOptions },
                            { key: "creditAllowed", label: "Credit Allowed", type: "select", options: ["Yes", "No"] },
                            { key: "address", label: "Address", type: "textarea" },
                            { key: "tier", label: "Tier", type: "select", options: ["Tier 1", "Tier 2", "Tier 3"] },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={customers || []}
                        columns={[
                            { key: "customerName", label: "Customer Name" },
                            { key: "tinNumber", label: "TIN" },
                            { key: "contactPerson", label: "Contact" },
                            { key: "contactNumber", label: "Phone" },
                            { key: "regionName", label: "Region" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="addresses" className="mt-4">
                    <MasterCrudPage
                        domain="customer-addresses"
                        title="Customer Addresses"
                        description="Manage multiple delivery and business addresses for your customers"
                        idPrefix="CAD"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "addressType", label: "Address Type", type: "select", options: ["Billing", "Shipping", "Residential", "Office"] },
                            { key: "address", label: "Full Address", type: "textarea", required: true },
                            { key: "locationArea", label: "Location/Area", type: "text" },
                            { key: "isPrimary", label: "Is Primary", type: "select", options: ["Yes", "No"] },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={addresses || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "addressType", label: "Type" },
                            { key: "locationArea", label: "Area" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="files" className="mt-4">
                    <MasterCrudPage
                        domain="customer-files"
                        title="Customer Files"
                        description="Manage document uploads and attachments for customers"
                        idPrefix="CFL"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "documentType", label: "Document Type", type: "text", placeholder: "e.g. License, Passport, ID" },
                            { key: "contentData", label: "Select File", type: "image", required: true },
                            { key: "fileName", label: "File Name (Auto-filled)", type: "text", required: true },
                            { key: "descriptions", label: "Remarks/Description", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={files || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "contentData", label: "File" },
                            { key: "documentType", label: "Type" },
                            { key: "fileName", label: "File Name" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="billing" className="mt-4">
                    <MasterCrudPage
                        domain="customer-billing-mappings"
                        title="Billing Mappings"
                        description="Map customers to specific company-wise billing locations"
                        idPrefix="CBM"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "billingLocationId", label: "Billing Location", type: "select", required: true, options: billingLocationOptions },
                            { key: "isDefault", label: "Is Default", type: "select", options: ["Yes", "No"] },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={billingMappings || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "billingName", label: "Billing Loc" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="vat" className="mt-4">
                    <MasterCrudPage
                        domain="customer-vat-settings"
                        title="Customer VAT Settings"
                        description="Customer-specific VAT percentage configurations"
                        idPrefix="CVT"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "vatPercentage", label: "VAT Percentage (%)", type: "number", required: true },
                            { key: "effectiveFrom", label: "Effective From", type: "date" },
                            { key: "effectiveTo", label: "Effective To", type: "date" },
                            { key: "requestStatus", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={vatSettings || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "vatPercentage", label: "VAT %" },
                            { key: "effectiveFrom", label: "From" },
                            { key: "requestStatus", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="pricing" className="mt-4">
                    <MasterCrudPage
                        domain="customer-pricing"
                        title="Customer Pricing"
                        description="Manage special pricing rules for specific customers and products"
                        idPrefix="CPP"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "productId", label: "Product", type: "select", required: true, options: productOptions },
                            { key: "unitPrice", label: "Special Unit Price", type: "number", required: true },
                            { key: "effectiveFrom", label: "Effective From", type: "date" },
                            { key: "effectiveTo", label: "Effective To", type: "date" },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={prices || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "productName", label: "Product" },
                            { key: "unitPrice", label: "Price" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="credit" className="mt-4">
                    <MasterCrudPage
                        domain="customer-credit-limits"
                        title="Credit Limits"
                        description="Define and manage credit limits and allowed balances for customers"
                        idPrefix="CCL"
                        fields={[
                            { key: "customerId", label: "Customer", type: "select", required: true, options: customerOptions },
                            { key: "companyId", label: "Company", type: "select", options: companyOptions },
                            { key: "approvedCreditLimitAmount", label: "Credit Limit Amount", type: "number", required: true },
                            { key: "totalOutstandingAmount", label: "Current Balance", type: "number" },
                            { key: "remarks", label: "Remarks", type: "textarea" },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={creditLimits || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "approvedCreditLimitAmount", label: "Limit" },
                            { key: "totalOutstandingAmount", label: "Balance" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="credit-files" className="mt-4">
                    <MasterCrudPage
                        domain="credit-limit-files"
                        title="Credit Limit Files"
                        description="Uploaded supporting documents for customer credit approvals"
                        idPrefix="CLF"
                        fields={[
                            { key: "creditLimitId", label: "Credit Limit Reference", type: "select", required: true, options: creditLimitOptions },
                            { key: "fileName", label: "File Name", type: "text", required: true },
                            { key: "filePath", label: "File Path", type: "text", required: true },
                            { key: "statusMaster", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={creditFiles || []}
                        columns={[
                            { key: "customerName", label: "Customer" },
                            { key: "fileName", label: "File Name" },
                            { key: "statusMaster", label: "Status" },
                        ]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
