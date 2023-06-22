/*      LEVELING DEBUGGING MENU
    interface for testing leveling system, including: gaining experience, gaining levels,
    attempting prestige, etc.

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
import { Color4, Vector3 } from "@dcl/sdk/math";
import { MenuGroup3D } from "./menu-group-3D";
import { InputAction, pointerEventsSystem } from "@dcl/sdk/ecs";
export class DebuggingMenuLeveling {
    //access pocketing
    private static instance: undefined | DebuggingMenuLeveling;
    public static get Instance(): DebuggingMenuLeveling {
        //ensure instance is set
        if (DebuggingMenuLeveling.instance === undefined) {
            DebuggingMenuLeveling.instance = new DebuggingMenuLeveling();
        }

        return DebuggingMenuLeveling.instance;
    }

    //3D tower builder view
    menuGroupLevelSystem: MenuGroup3D;
    towerDefinitionIndex: number = 0;    //selected tower def

    //callbacks
    //get
    //  get experience
    public GetExperience: () => number = this.getExperience;
    private getExperience(): number { console.log("game menu callback not set - get experience"); return 0; }
    //  get experience next
    public GetExperienceNext: () => number = this.getExperience;
    private getExperienceNext(): number { console.log("game menu callback not set - get next experience"); return 0; }
    //  get experience
    public GetLevel: () => number = this.getLevel;
    private getLevel(): number { console.log("game menu callback not set - get level"); return 0; }
    //  get experience
    public GetPrestige: () => number = this.getPrestige;
    private getPrestige(): number { console.log("game menu callback not set - get prestige"); return 0; }
    //  get rewards string
    public GetStringRewards: (level: number) => string = this.getStringRewards;
    private getStringRewards(level: number): string { console.log("game menu callback not set - get level rewards string"); return ""; }
    //  get permissions string
    public GetStringPermissions: (level: number) => string = this.getStringPermissions;
    private getStringPermissions(level: number): string { console.log("game menu callback not set - get level permissions string"); return ""; }
    //processing
    //  reset level system
    public Initialize: (experience: number, prestige: number) => void = this.initialize;
    private initialize(experience: number, prestige: number) { console.log("game menu callback not set - reset"); }
    //  add experience
    public AddExperience: (value: number) => void = this.addExperience;
    private addExperience(value: number) { console.log("game menu callback not set - add experience"); }
    //  attempt perstige
    public AttemptPerstige: () => void = this.attemptPerstige;
    private attemptPerstige() { console.log("game menu callback not set - attempt perstige"); }

    //constructor
    //  generates and places each object
    private expValue: number[] = [100, 500, 1000, 10000, 100000];
    constructor() {
        //group config
        this.menuGroupLevelSystem = new MenuGroup3D();
        this.menuGroupLevelSystem.SetColour(Color4.create(1, 0, 1, 1));
        this.menuGroupLevelSystem.AdjustMenuParent(0, Vector3.create(11, 1.5, 14));

        //parent object setup
        //  create overhead object
        this.menuGroupLevelSystem.AddMenuObject("menuOffset", 0);
        this.menuGroupLevelSystem.AdjustMenuObject("menuOffset", 0, Vector3.create(0, 0, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("menuOffset", 1, Vector3.create(1, 1, 1));

        //display setup
        //  main display object
        this.menuGroupLevelSystem.AddMenuObject("levelInfoFrame", 2, "menuOffset");
        this.menuGroupLevelSystem.AdjustMenuObject("levelInfoFrame", 0, Vector3.create(0, 0, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("levelInfoFrame", 1, Vector3.create(1, 1, 1));
        //  main display offset object
        this.menuGroupLevelSystem.AddMenuObject("levelInfo", 0, "menuOffset");
        this.menuGroupLevelSystem.AdjustMenuObject("levelInfo", 0, Vector3.create(0, 0, 0.0125));
        this.menuGroupLevelSystem.AdjustMenuObject("levelInfo", 1, Vector3.create(1, 1, 1));
        //  label header text
        this.menuGroupLevelSystem.AddMenuText("levelInfo", "menuLabel", "SYSTEM DEBUGGING\nLEVELING");
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "menuLabel", 0, Vector3.create(0, 0.59, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "menuLabel", 1, Vector3.create(0.4, 0.4, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "menuLabel", 0, 5);

        //current prestige display
        this.menuGroupLevelSystem.AddMenuText("levelInfo", "prestigeText", "Current Prestige: ###");
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "prestigeText", 0, Vector3.create(-1.1, 0.32, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "prestigeText", 1, Vector3.create(0.25, 0.25, 0.25));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "prestigeText", 0, 5);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "prestigeText", 2, 1, 0);
        //current level display
        this.menuGroupLevelSystem.AddMenuText("levelInfo", "levelText", "Current Level: ###");
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "levelText", 0, Vector3.create(-1.1, 0.16, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "levelText", 1, Vector3.create(0.25, 0.25, 0.25));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "levelText", 0, 5);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "levelText", 2, 1, 0);
        //current experience display
        this.menuGroupLevelSystem.AddMenuText("levelInfo", "expCurrentText", "Current Experience: #######");
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "expCurrentText", 0, Vector3.create(-1.1, -0.0, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "expCurrentText", 1, Vector3.create(0.25, 0.25, 0.25));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "expCurrentText", 0, 5);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "expCurrentText", 2, 1, 0);
        //required experience display
        this.menuGroupLevelSystem.AddMenuText("levelInfo", "expRequiredText", "Required Experience: ######");
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "expRequiredText", 0, Vector3.create(-1.1, -0.16, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelInfo", "expRequiredText", 1, Vector3.create(0.25, 0.25, 0.25));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "expRequiredText", 0, 5);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelInfo", "expRequiredText", 2, 1, 0);

        //buttons -> add experience
        for (var i: number = 0; i < this.expValue.length; i++) 
        {
            //  object
            this.menuGroupLevelSystem.AddMenuObject("interactAddExp"+i, 5, "levelInfo");
            this.menuGroupLevelSystem.AdjustMenuObject("interactAddExp"+i, 0, Vector3.create(((i - 2.5) * 0.50) + 0.25, -0.40, 0));
            this.menuGroupLevelSystem.AdjustMenuObject("interactAddExp"+i, 1, Vector3.create(0.15, 0.15, 0.15));
            //  click event
            const value = this.expValue[i];
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.menuGroupLevelSystem.GetMenuObject("interactAddExp"+i).entity,
                    opts: 
                    {
                        hoverText: "ADD EXPERIENCE: "+value,
                        button: InputAction.IA_POINTER
                    }
                },
                () => {
                    console.log("value: "+value);
                    
                    this.AddExperience(value);
                }
            );
            //  label
            this.menuGroupLevelSystem.AddMenuText("interactAddExp"+i, "buttonLabel", "ADD : "+value);
            this.menuGroupLevelSystem.AdjustTextObject("interactAddExp"+i, "buttonLabel", 0, Vector3.create(0, 0, -0.04));
            this.menuGroupLevelSystem.AdjustTextObject("interactAddExp"+i, "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
            this.menuGroupLevelSystem.AdjustTextDisplay("interactAddExp"+i, "buttonLabel", 0, 1);
        }

        //button -> reset level
        //  object
        this.menuGroupLevelSystem.AddMenuObject("interactReset", 5, "levelInfo");
        this.menuGroupLevelSystem.AdjustMenuObject("interactReset", 0, Vector3.create(-0.45, -0.675, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("interactReset", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuGroupLevelSystem.GetMenuObject("interactReset").entity,
                opts: 
                {
                    hoverText: "[E] RESET LEVEL",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                this.Initialize(0, 0);
            }
        );
        //  label
        this.menuGroupLevelSystem.AddMenuText("interactReset", "buttonLabel", "RESET\nLEVEL");
        this.menuGroupLevelSystem.AdjustTextObject("interactReset", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuGroupLevelSystem.AdjustTextObject("interactReset", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("interactReset", "buttonLabel", 0, 1);

        //button -> perstige
        //  object
        this.menuGroupLevelSystem.AddMenuObject("interactPerstige", 5, "levelInfo");
        this.menuGroupLevelSystem.AdjustMenuObject("interactPerstige", 0, Vector3.create(0.0, -0.675, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("interactPerstige", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuGroupLevelSystem.GetMenuObject("interactPerstige").entity,
                opts: 
                {
                    hoverText: "[E] ATTEMPT PERSTIGE",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                this.AttemptPerstige();
            }
        );
        //  label
        this.menuGroupLevelSystem.AddMenuText("interactPerstige", "buttonLabel", "PERSTIGE");
        this.menuGroupLevelSystem.AdjustTextObject("interactPerstige", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuGroupLevelSystem.AdjustTextObject("interactPerstige", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("interactPerstige", "buttonLabel", 0, 2);

        //button -> server save
        //  object
        this.menuGroupLevelSystem.AddMenuObject("interactSave", 5, "levelInfo");
        this.menuGroupLevelSystem.AdjustMenuObject("interactSave", 0, Vector3.create(0.45, -0.675, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("interactSave", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuGroupLevelSystem.GetMenuObject("interactSave").entity,
                opts: 
                {
                    hoverText: "SAVE TO SERVER (ADD YOUR CODE)",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                //put your server code here
            }
        );
        //  label
        this.menuGroupLevelSystem.AddMenuText("interactSave", "buttonLabel", "SAVE TO\nSERVER");
        this.menuGroupLevelSystem.AdjustTextObject("interactSave", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuGroupLevelSystem.AdjustTextObject("interactSave", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("interactSave", "buttonLabel", 0, 1);

        //button -> server load
        //  object
        this.menuGroupLevelSystem.AddMenuObject("interactLoad", 5, "levelInfo");
        this.menuGroupLevelSystem.AdjustMenuObject("interactLoad", 0, Vector3.create(0.9, -0.675, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("interactLoad", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuGroupLevelSystem.GetMenuObject("interactLoad").entity,
                opts: 
                {
                    hoverText: "LOAD FROM SERVER (ADD YOUR CODE)",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                //put your server code here
            }
        );
        //  label
        this.menuGroupLevelSystem.AddMenuText("interactLoad", "buttonLabel", "LOAD FROM\nSERVER");
        this.menuGroupLevelSystem.AdjustTextObject("interactLoad", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuGroupLevelSystem.AdjustTextObject("interactLoad", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("interactLoad", "buttonLabel", 0, 1);

        //display setup
        //  main display object
        this.menuGroupLevelSystem.AddMenuObject("levelRewardsFrame", 1, "menuOffset");
        this.menuGroupLevelSystem.AdjustMenuObject("levelRewardsFrame", 0, Vector3.create(2.35, 0, 0));
        this.menuGroupLevelSystem.AdjustMenuObject("levelRewardsFrame", 1, Vector3.create(1, 1, 1));
        //  main display offset object
        this.menuGroupLevelSystem.AddMenuObject("levelRewardsInfo", 0, "levelRewardsFrame");
        this.menuGroupLevelSystem.AdjustMenuObject("levelRewardsInfo", 0, Vector3.create(0, 0, 0.0125));
        this.menuGroupLevelSystem.AdjustMenuObject("levelRewardsInfo", 1, Vector3.create(1, 1, 1));
        //  label header text
        this.menuGroupLevelSystem.AddMenuText("levelRewardsInfo", "menuLabel", "LEVELING REWARDS");
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "menuLabel", 0, Vector3.create(0, 0.60, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "menuLabel", 1, Vector3.create(0.4, 0.4, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelRewardsInfo", "menuLabel", 0, 3);

        //previous rewards
        this.menuGroupLevelSystem.AddMenuText("levelRewardsInfo", "levelRewardsPrev", "Previous Rewards:");
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "levelRewardsPrev", 0, Vector3.create(-0.7, 0.4, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "levelRewardsPrev", 1, Vector3.create(0.4, 0.4, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelRewardsInfo", "levelRewardsPrev", 0, 2);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelRewardsInfo", "levelRewardsPrev", 2, 0, 0);
        //next rewards
        this.menuGroupLevelSystem.AddMenuText("levelRewardsInfo", "levelRewardsNext", "Next Rewards:");
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "levelRewardsNext", 0, Vector3.create(-0.7, -0.2, 0));
        this.menuGroupLevelSystem.AdjustTextObject("levelRewardsInfo", "levelRewardsNext", 1, Vector3.create(0.4, 0.4, 1));
        this.menuGroupLevelSystem.AdjustTextDisplay("levelRewardsInfo", "levelRewardsNext", 0, 2);
        this.menuGroupLevelSystem.AdjustTextDisplay("levelRewardsInfo", "levelRewardsNext", 2, 0, 0);
    }

    //rewrites the level display
    public UpdateDisplay() {
        this.menuGroupLevelSystem.SetMenuText("levelInfo", "prestigeText", "Current Prestige: " + this.GetPrestige());
        this.menuGroupLevelSystem.SetMenuText("levelInfo", "levelText", "Current Level: " + (this.GetLevel()));
        this.menuGroupLevelSystem.SetMenuText("levelInfo", "expCurrentText", "Current Experience: " + this.GetExperience());
        this.menuGroupLevelSystem.SetMenuText("levelInfo", "expRequiredText", "Required Experience: " + this.GetExperienceNext());

        this.menuGroupLevelSystem.SetMenuText("levelRewardsInfo", "levelRewardsPrev", "Previous Rewards: (level=" + (this.GetLevel() - 1) + ")\n"
            + this.GetStringRewards(this.GetLevel() - 1) + this.GetStringPermissions(this.GetLevel() - 1));
        this.menuGroupLevelSystem.SetMenuText("levelRewardsInfo", "levelRewardsNext", "Next Rewards: (level=" + this.GetLevel() + ")\n"
            + this.GetStringRewards(this.GetLevel()) + this.GetStringPermissions(this.GetLevel()));
    }
}