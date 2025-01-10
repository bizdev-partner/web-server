import { Activity } from "./Activity";
import * as Contracts from "./contracts";

export interface IActivityService {
    /**
     * Validates and schedules a new activity.
     * @param command The command containing details to schedule an activity.
     * @returns The scheduled activity.
     */
    scheduleActivity(command: Contracts.IScheduleActivityCommand): Promise<Activity>;

    /**
     * Marks an activity as completed and triggers relevant events.
     * @param command The command containing details to complete an activity.
     * @returns The updated activity.
     */
    completeActivity(command: Contracts.ICompleteActivityCommand): Promise<Activity>;

    /**
     * Cancels an activity and performs any related cleanup.
     * @param command The command containing details to cancel an activity.
     * @returns The updated activity.
     */
    cancelActivity(command: Contracts.ICancelActivityCommand): Promise<Activity>;

    /**
     * Updates an activity's schedule and propagates changes as needed.
     * @param command The command containing details to reschedule an activity.
     * @returns The updated activity.
     */
    rescheduleActivity(command: Contracts.IRescheduleActivityCommand): Promise<Activity>;

    /**
     * Retrieves all activities for a given lead.
     * @param query The query containing the lead ID to retrieve activities for.
     * @returns A list of activities associated with the lead.
     */
    getActivitiesForLead(query: Contracts.ListActivitiesForLeadQuery): Promise<Activity[]>;

    /**
     * Retrieves detailed information about an activity.
     * @param query The query containing the activity ID to retrieve details for.
     * @returns The detailed activity.
     */
    getActivityDetails(query: Contracts.GetActivityDetailsQuery): Promise<Activity>;    /**
    
    * Retrieves a list of templated activities generated from predefined ActivityTypes.
    * @param query The query for retrieving activity templates.
    * @returns A list of activity templates.
    */
   getActivityTemplates(query: Contracts.ListActivityTemplatesQuery): Promise<Activity[]>;

}
