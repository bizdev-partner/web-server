import { Activity } from "./Activity";
import { GlobalIdentifier, Repository, UniqueIdentifier } from "@vannatta-software/ts-domain";

export interface IActivityRepository extends Repository<Activity> {
    /**
     * Stores a new or updated activity.
     * @param activity The activity to save.
     * @returns A promise resolving when the activity is saved.
     */
    save(activity: Activity): Promise<void>;

    /**
     * Retrieves an activity by its unique identifier.
     * @param activityId The unique identifier of the activity.
     * @returns A promise resolving with the found activity or undefined if not found.
     */
    findById(activityId: GlobalIdentifier): Promise<Activity | undefined>;

    /**
     * Retrieves all activities associated with a specific lead.
     * @param leadId The unique identifier of the lead.
     * @returns A promise resolving with an array of activities associated with the lead.
     */
    findByCampaign(campaignId: UniqueIdentifier): Promise<Activity[]>;

    /**
     * Retrieves all activities associated with a specific lead.
     * @param leadId The unique identifier of the lead.
     * @returns A promise resolving with an array of activities associated with the lead.
     */
    findByLeadId(leadId: UniqueIdentifier): Promise<Activity[]>;

    /**
     * Removes an activity from the repository.
     * @param activityId The unique identifier of the activity to remove.
     * @returns A promise resolving when the activity is deleted.
     */
    delete(activityId: GlobalIdentifier): Promise<void>;
}
