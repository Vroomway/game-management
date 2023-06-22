/*      LEVELING MANAGER
    provides an interface for processing player's experience, level, and prestige. before
    initializing/using system ensure all delegation methods have been assigned. all actual data
    values for experience and prestige are stored in the inventory manager as token objects (levels
        are dynamically calculated via the player's current experience, do not need a data object or
        sever read/write)

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
import { Entity, Transform, engine } from "@dcl/sdk/ecs";
import { DebuggingMenuLeveling } from "../debugging/debug-menu-leveling";
import { ItemNameLeveling } from "../inventory/inventory-data";
import { InventoryManager } from "../inventory/inventory-manager";
import { LevelPermissionData, LevelRewardData } from "./level-data";
import { Vector3 } from "@dcl/sdk/math";
//object that represents an enemy in scene
export class LevelManager {
    //if true, all debugging logs will be visible (ensure is false when deploying to remove overhead)
    private static IsDebugging: boolean = true;

    //access pocketing
    private static instance: undefined | LevelManager;
    public static get Instance(): LevelManager {
        //ensure instance is set
        if (LevelManager.instance === undefined) {
            //create new instance
            LevelManager.instance = new LevelManager();
            //set default values
            LevelManager.instance.Initialize(0, 0);
        }

        return LevelManager.instance;
    }

    //permissions settings
    //  populate these with ui/entities that should be enabled as permissions are acquired
    public permTeleports = [];
    public permWearables = [];
    //DEBUGGING: example implementation for tp and wearable claim
    permObjects_teleports: Entity[] = [];
    permObjects_wearables: Entity[] = [];

    //calculation settings
    private experienceConstant: number = 0.07;
    private experiencePower: number = 2.0;

    //experience
    private get experience(): number { return InventoryManager.Instance.GetItemCountByID(ItemNameLeveling.exp); }
    private set experience(value: number) { InventoryManager.Instance.SetItemCountByID(ItemNameLeveling.exp, value); }
    private experienceMax: number = 0;
    //level
    private levelMax: number = 59;
    public get Level(): number { return InventoryManager.Instance.GetItemCountByID(ItemNameLeveling.lvl); }
    public set Level(value: number) { InventoryManager.Instance.SetItemCountByID(ItemNameLeveling.lvl, value); }
    //prestige
    private prestige: number = 0;

    //callbacks
    //  initialize
    public CallbackInitialize(experience: number, prestige: number) { return LevelManager.Instance.Initialize(experience, prestige); }
    //  experience
    public CallbackGetExperience(): number { return LevelManager.Instance.experience; }
    /** returns experience required to complete the given level */
    public CallbackGetExperienceNext(): number {
        if (LevelManager.Instance.Level != LevelManager.Instance.levelMax) {
            return LevelManager.Instance.CalculateExperienceRequiredForLevel(LevelManager.Instance.Level + 1)
                - LevelManager.Instance.experience;
        }
        else {
            return 0;
        }
    }
    //  level
    public GetLevelDisplayValue(): number { return LevelManager.Instance.Level + 1; }  //offset by 1 for display
    //  attempt perstige
    public CallbackGetPrestige(): number { return LevelManager.Instance.prestige; }
    public CallbackPerstigeAttempt() { LevelManager.Instance.AttemptPrestige(); }
    //  display helper callback methods
    public GetLevelRewards(level: number): string { return LevelManager.Instance.GetRewardString(level); }
    public GetLevelPermissions(level: number): string { return LevelManager.Instance.GetPermissionsString(level); }

    /**
     * prepares the leveling system for use, assigning experience and level
     * @param experience starting experience count, assigning experience this way ignores 
     * the reward delivering process 
     */
    public Initialize(experience: number, prestige: number) {
        if (LevelManager.IsDebugging)console.log("Leveling System: initializing...");

        //calculate limit
        this.experienceMax = this.CalculateExperienceRequiredForLevel(this.levelMax) + 1;

        //set data defaults
        this.SetExperience(experience);
        this.prestige = prestige;

        //update debug menu
        DebuggingMenuLeveling.Instance.UpdateDisplay();

        if (LevelManager.IsDebugging) console.log("Leveling System: initialized (experience=" + this.experience.toString() + ", level=" + this.Level.toString() + ")");
        return this;
    }

    /**
     * takes in an experience value and returns the repsective level
     * @param experience starting experience count, assigning experience this way ignores 
     * the reward delivering process 
     */
    public CalculateLevel(experience: number): number {
        //calculate level
        return Math.floor(this.experienceConstant * Math.pow(experience, 1 / this.experiencePower));
    }

    /**
     * takes in a given level and returns the experience required 
     * @param level targeted level to get experience for
     */
    public CalculateExperienceRequiredForLevel(level: number): number {
        //calculate level
        return Math.floor(Math.pow(level / this.experienceConstant, this.experiencePower));
    }

    private testLevel: number = 0;
    public CallbackAddExperience(value: number) { return LevelManager.Instance.AddExperience(value); }
    /**
     * increases the current experience value by the given amount, calculates the new level,
     * and provides the player with rewards for the newly achieved levels.
        NOTE: will only pull down a level above max upon level change
        NOTE: expereince is still gained past the max level point, but levels do not reflect this growth
            past the max level
     * @param experience newly aquirred experience added to the player's current experience count 
     */
    public AddExperience(value: number) {
        var expLog: string = "Leveling System: adding " + value.toString() + "...";
        console.log("TEST");
        //add experience
        this.experience += value;

        if (this.experience > this.experienceMax) {
            if (LevelManager.IsDebugging) expLog += "\n\tapplied experience exceeds allowed max, leashing exp (cur="
                + this.experience.toString() + ",max=" + this.experienceMax.toString() + ")";

            this.experience = this.experienceMax;
        }

        //find new level
        this.testLevel = this.CalculateLevel(this.experience);
        expLog += "\n\texperience applied, new level calculated (old=" + this.Level.toString() + ", new=" + this.testLevel.toString() + ")";

        //provide rewards of every level difference
        this.levelChange = false;
        while (this.Level != this.testLevel) {
            //max level check
            this.levelChange = true;
            if (this.Level >= this.levelMax) {
                if (LevelManager.IsDebugging) expLog += "\n\tnew level is higher than max level, leashing level";

                //pull down to max level
                this.Level = this.levelMax;
                break;
            }

            if (LevelManager.IsDebugging) expLog += "\n\tnew level acquired, level " + (this.Level + 1).toString() + ", delivering rewards...";

            //provide rewards
            this.ProcessLevelRewards(++this.Level);
        }

        //send a single call upon level change to update UI
        if (this.levelChange) {
            if (LevelManager.IsDebugging) expLog += "\n\tlevel has chnged, updating permissions...";
            //process new permissions
            this.ProcessPermissions(this.Level);
        }

        //update debug menu
        DebuggingMenuLeveling.Instance.UpdateDisplay();

        if (LevelManager.IsDebugging) console.log(expLog + "\nsuccessfully added experience (new value=" + this.experience + ")");
    }

    /**
     * sets player's experience to given experience, adjusting level, changes permissions, but ignores rewards
     * @param experience value to set the player's current experience count to 
     */
    private levelChange: boolean = false;
    public SetExperience(value: number) {
        if (LevelManager.IsDebugging)console.log("Leveling System: setting " + value.toString() + "...");

        //redefine experience
        this.experience = value;
        //calculate new level
        this.Level = this.CalculateLevel(value);

        //process new permissions
        this.ProcessPermissions(this.Level);

        //update debug menu
        DebuggingMenuLeveling.Instance.UpdateDisplay();

        if (LevelManager.IsDebugging)console.log("Leveling System: successfully set experience!");
    }

    /**
     * takes in an experience value and returns the repsective level
     * @param experience starting experience count, assigning experience this way ignores 
     * the reward delivering process 
     */
    public AttemptPrestige() {
        if (LevelManager.IsDebugging)console.log("Leveling System: attempting to prestige...");

        //check max level
        if (this.Level < this.levelMax) {
            if (LevelManager.IsDebugging)console.log("Leveling System: failed prestige (current level too low level=" + this.Level.toString() + ")");
            return;
        }

        //TODO: check available resources for required prestige cost

        //apply prestige and reset exp 
        this.prestige++;
        this.SetExperience(0);

        //TODO: remove required resources

        //update debug menu
        DebuggingMenuLeveling.Instance.UpdateDisplay();

        if (LevelManager.IsDebugging)console.log("Leveling System: prestige successful!");
    }

    /**
     * provides the player with rewards for a given level, providing them with all newly acquired rewards
     * @param level level rewards to be delivered
     */
    logLevelRewards: string = "";
    public ProcessLevelRewards(level: number) {
        if (LevelManager.IsDebugging) this.logLevelRewards = "Leveling System: providing level reward for level " + level.toString();

        //ensure rewards exist for required level
        if (level >= Object.keys(LevelRewardData).length) return;

        //process every reward for given level
        for (var i: number = 0; i < LevelRewardData[level.toString()].length; i++) {
            //add reward to player inventory
            InventoryManager.Instance.AddItemCountByID(LevelRewardData[level][i][0], LevelRewardData[level][i][1]);
        }

        if (LevelManager.IsDebugging)console.log(this.logLevelRewards + "\n" + this.GetRewardString(level));
    }

    /**
     * redefines the player's permissions, effecting teleports and wearable claim access
     * @param level target level to set permission access to
     */
    public CallbackProcessPermissions(level: number) { { LevelManager.Instance.ProcessPermissions(level) }; }
    public ProcessPermissions(level: number) {
        if (LevelManager.IsDebugging)console.log("Leveling System: setting player permissions for level " + level + "...");

        //NOTE: this is the primary switchboard for controlling the state/updates for permissions (tp, claim, whatever else you set up)
        //  it is assumed that each type will have its own processing per type (for de/activation), 
        //      ex: checking if player has already claimed wearable

        //process permissions
        //  teleports
        for (var i: number = 0; i < Object.keys(LevelPermissionData.PermissionsTeleports).length; i++) {
            //ensure target object exists (due to the way things are initialized in the game there is the possiblity
            //  objects are not created yet)
            if (this.permObjects_teleports.length <= LevelPermissionData.PermissionsTeleports[i][1]) {
                continue;
            }

            //activate 
            if (level >= LevelPermissionData.PermissionsTeleports[i][0]) {
                //TODO: append your activation code to the end of this line
                Transform.getMutable(this.permObjects_teleports[LevelPermissionData.PermissionsTeleports[i][1]]).scale = Vector3.create(0.5, 2, 0.5);
            }
            //deactivate
            else {
                //TODO: append your deactivation code to the end of this line
                Transform.getMutable(this.permObjects_teleports[LevelPermissionData.PermissionsTeleports[i][1]]).scale = Vector3.Zero();
            }
        }
        //  wearable claims
        for (var i: number = 0; i < Object.keys(LevelPermissionData.PermissionsWearables).length; i++) {
            //ensure target object exists (due to the way things are initialized in the game there is the possiblity
            //  objects are not created yet)
            if (this.permObjects_wearables.length <= LevelPermissionData.PermissionsWearables[i][1]) {
                continue;
            }

            //activate 
            if (level >= LevelPermissionData.PermissionsWearables[i][0]) {
                //TODO: append your activation code to the end of this line
                Transform.getMutable(this.permObjects_wearables[LevelPermissionData.PermissionsWearables[i][1]]).scale = Vector3.create(0.5, 2, 0.5);
            }
            //deactivate
            else {
                //TODO: append your deactivation code to the end of this line
                Transform.getMutable(this.permObjects_wearables[LevelPermissionData.PermissionsWearables[i][1]]).scale = Vector3.Zero();
            }
        }
        if (LevelManager.IsDebugging)console.log("Leveling System: player permissions set for level " + level + "!");
    }

    /**
     * helper function used to create debug/diplay text representing the rewards for a level
     * @param level level to produce reward string for
     * @return string stating all level rewards that will be given at level
     */
    public GetRewardString(level: number): string {
        var str: string = "";

        //process every reward for given level
        for (var i: number = 0; i < LevelRewardData[level.toString()].length; i++) {
            //seperate each entry with a new line
            if (i != 0) str += "\n";

            //create entry based on reward
            str += LevelRewardData[level][i][1] //count
                + " x " + LevelRewardData[level][i][0]; //name
        }

        return str;
    }

    /**
     * helper function used to create debug/diplay text representing the rewards for a level
     * @param level level to produce reward string for
     * @return string stating all level rewards that will be given at level
     */
    public GetPermissionsString(level: number): string {
        var str: string = "";

        //process every permission
        //  teleports
        for (var i: number = 0; i < LevelPermissionData.PermissionsTeleports.length; i++) {
            if (level == LevelPermissionData.PermissionsTeleports[i][0]) {
                //create entry based on reward
                str += "\n" + LevelPermissionData.PermissionsTeleports[i][2] //name
                    + " (teleport)"; //type
            }
        }
        //  claims
        for (var i: number = 0; i < LevelPermissionData.PermissionsWearables.length; i++) {
            if (level == LevelPermissionData.PermissionsWearables[i][0]) {
                //create entry based on reward
                str += "\n" + LevelPermissionData.PermissionsWearables[i][2] //name
                    + " (wearable)"; //type
            }
        }

        return str;
    }
}