"use client";

import { useState } from "react";
import MasterCrudPage from "@/components/MasterCrudPage";
import { useMasterData } from "@/hooks/useMasterData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FieldsPage() {
    const { data: headers } = useMasterData("field-headers");
    const { data: details } = useMasterData("field-details");

    const headerOptions = headers?.map((h: any) => ({
        value: h.id,
        label: h.fieldCategoryFldHdr || `Header ${h.id}`
    })) || [];

    return (
        <div className="space-y-6">
            <Tabs defaultValue="headers" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="headers">Field Headers</TabsTrigger>
                    <TabsTrigger value="details">Field Details (Activities)</TabsTrigger>
                </TabsList>

                <TabsContent value="headers">
                    <MasterCrudPage
                        domain="field-headers"
                        title="Field Headers"
                        description="Define master field categories and headers"
                        idPrefix="FLH"
                        fields={[
                            { key: "projectNameFldHdr", label: "Project Name", type: "text" },
                            { key: "fieldCategoryFldHdr", label: "Category", type: "text", required: true },
                            { key: "fieldDescFldHdr", label: "Description", type: "text" },
                            { key: "remarksFldHdr", label: "Remarks", type: "textarea" },
                            { key: "statusFldHdr", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={headers || []}
                        columns={[
                            { key: "fieldCategoryFldHdr", label: "Category" },
                            { key: "projectNameFldHdr", label: "Project" },
                            { key: "fieldDescFldHdr", label: "Description" },
                            { key: "statusFldHdr", label: "Status" },
                        ]}
                    />
                </TabsContent>

                <TabsContent value="details">
                    <MasterCrudPage
                        domain="field-details"
                        title="Field Details"
                        description="Define specific activities for field headers"
                        idPrefix="FLD"
                        fields={[
                            { key: "fieldIdFldDtl", label: "Field Header", type: "select", required: true, options: headerOptions },
                            { key: "activityNameFldDtl", label: "Activity Name", type: "text", required: true },
                            { key: "activityDescFldDtl", label: "Activity Description", type: "textarea" },
                            { key: "remarksFldDtl", label: "Remarks", type: "textarea" },
                            { key: "statusFldDtl", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] },
                        ]}
                        initialData={details || []}
                        columns={[
                            { key: "headerFieldCategoryFldHdr", label: "Category" },
                            { key: "activityNameFldDtl", label: "Activity" },
                            { key: "statusFldDtl", label: "Status" },
                        ]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
