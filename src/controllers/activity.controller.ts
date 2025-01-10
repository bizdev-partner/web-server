import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import * as Contracts from '@domain/activity/contracts';

@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Get('templates')
    async getActivityTemplates() {
        return this.activityService.getActivityTemplates({});
    }

    @Get(':id')
    async getActivityDetails(@Param('id') id: string) {
        return this.activityService.getActivityDetails({ activityId: id });
    }

    @Get('/lead/:leadId')
    async getActivitiesForLead(@Param('leadId') leadId: string) {
        return this.activityService.getActivitiesForLead({ leadId: leadId });
    }

    @Get('/campaign/:campaignId')
    async getCampaignActivities(@Param('campaignId') campaignId: string) {
        return this.activityService.getActivitiesForCampaign({ campaignId: campaignId });
    }

    @Post()
    async scheduleActivity(@Body() command: Contracts.IScheduleActivityCommand) {
        return this.activityService.scheduleActivity(command);
    }

    @Patch(':id')
    async updateActivity(@Body() command: Contracts.IUpdateActivityCommand) {
        return this.activityService.updateActivity(command);
    }

    @Patch(':id/complete')
    async completeActivity(
        @Param('id') id: string,
        @Body() command: Omit<Contracts.ICompleteActivityCommand, 'activityId'>,
    ) {
        return this.activityService.completeActivity({ ...command, activityId: id });
    }

    @Patch(':id/reschedule')
    async rescheduleActivity(
        @Param('id') id: string,
        @Body() command: Omit<Contracts.IRescheduleActivityCommand, 'activityId'>,
    ) {
        return this.activityService.rescheduleActivity({ ...command, activityId: id });
    }

    @Delete(':id')
    async cancelActivity(@Param('id') id: string) {
        console.log(id)
        return this.activityService.cancelActivity({ activityId: id });
    }
}
