import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ActivityService } from '../services/activity.service';
import * as Contracts from '@domain/activity/contracts';

@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Get('templates')
    async getActivityTemplates() {
        const query = new Contracts.ListActivityTemplatesQuery();
        return this.activityService.getActivityTemplates(query);
    }

    @Get(':id')
    async getActivityDetails(@Param('id') id: string) {
        const query = new Contracts.GetActivityDetailsQuery(id);
        return this.activityService.getActivityDetails(query);
    }

    @Get('/lead/:leadId')
    async getActivitiesForLead(@Param('leadId') leadId: string) {
        const query = new Contracts.ListActivitiesForLeadQuery(leadId);
        return this.activityService.getActivitiesForLead(query);
    }

    @Post()
    async scheduleActivity(@Body() command: Contracts.ScheduleActivityCommand) {
        return this.activityService.scheduleActivity(command);
    }

    @Patch(':id/complete')
    async completeActivity(
        @Param('id') id: string,
        @Body() command: Contracts.CompleteActivityCommand
    ) {
        command.activityId = id;
        return this.activityService.completeActivity(command);
    }

    @Patch(':id/reschedule')
    async rescheduleActivity(
        @Param('id') id: string,
        @Body() command: Contracts.RescheduleActivityCommand
    ) {
        command.activityId = id;
        return this.activityService.rescheduleActivity(command);
    }

    @Delete(':id')
    async cancelActivity(@Param('id') id: string) {
        const command = new Contracts.CancelActivityCommand();
        command.activityId = id;
        return this.activityService.cancelActivity(command);
    }
}
