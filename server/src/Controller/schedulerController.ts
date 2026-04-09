import { Request, Response } from "express";
import { db } from "../db/index.js";
import { TBL_SCHEDULER_SETTINGS } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { initScheduler } from "../utils/scheduler.js";

export const getSchedulerSettings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await db.select().from(TBL_SCHEDULER_SETTINGS).orderBy(TBL_SCHEDULER_SETTINGS.SNO);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSchedulerSetting = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { sno } = req.params;
        const { cronExpression, isEnabled, remarks, modifiedBy } = req.body;
        const snoId = Array.isArray(sno) ? parseInt(sno[0]) : parseInt(sno);

        await db.update(TBL_SCHEDULER_SETTINGS)
            .set({
                CRON_EXPRESSION: cronExpression,
                IS_ENABLED: isEnabled,
                REMARKS: remarks,
                MODIFIED_BY: modifiedBy || "System",
                MODIFIED_DATE: new Date()
            })
            .where(eq(TBL_SCHEDULER_SETTINGS.SNO, snoId));

        // Reschedule jobs immediately
        await initScheduler();

        return res.status(200).json({ msg: "Scheduler setting updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
