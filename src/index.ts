/**   INDEX 
    this acts as the main initialization point for the scene,
    currently just enables both debugging menues. 
 
    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/

import { Color4, Vector3 } from "@dcl/sdk/math";
import { DebugMenuController } from "./debugging/debug-menu-controller";
import { MenuGroup3D } from "./debugging/menu-group-3D";

//initialize debugging menu
DebugMenuController.Instance.InitDebugMenuInventory();
DebugMenuController.Instance.InitDebugMenuLeveling();

//info menu
const infoMenu = new MenuGroup3D();
infoMenu.SetColour(Color4.create(1, 0, 1, 1));
infoMenu.AdjustMenuParent(0, Vector3.create(8, 1.5, 14));
//display setup
//  main display object
infoMenu.AddMenuObject("infoFrame", 2,);
infoMenu.AdjustMenuObject("infoFrame", 0, Vector3.create(0, 0, 0));
infoMenu.AdjustMenuObject("infoFrame", 1, Vector3.create(1, 1, 1));
//  main display offset object
infoMenu.AddMenuObject("displayInfo", 0,);
infoMenu.AdjustMenuObject("displayInfo", 0, Vector3.create(0, 0, 0.0125));
infoMenu.AdjustMenuObject("displayInfo", 1, Vector3.create(1, 1, 1));
//  label header text
infoMenu.AddMenuText("displayInfo", "infoHeader", "SCENE INFO");
infoMenu.AdjustTextObject("displayInfo", "infoHeader", 0, Vector3.create(0, 0.71, 0));
infoMenu.AdjustTextObject("displayInfo", "infoHeader", 1, Vector3.create(0.4, 0.4, 1));
infoMenu.AdjustTextDisplay("displayInfo", "infoHeader", 0, 5);
//  label content text
infoMenu.AddMenuText("displayInfo", "infoContent", 
"This scene outlines the general usage of the inventory & leveling systems used in Vroomway."
+ "\n\nThe inventory manager manages inventories with multiple different types of items, along with callbacks that can be populated to auto update your displays."
+ "\n\nThe leveling manager keeps track of a player's experience, level, and prestige. It also includes leveling rewards (gain resources/permissions as you level)."
+ "\n\nsponsored by Vroomway"
+ "\ncreated by TheCryptoTrader69");
infoMenu.AdjustTextObject("displayInfo", "infoContent", 0, Vector3.create(0, 0.52, 0));
infoMenu.AdjustTextObject("displayInfo", "infoContent", 1, Vector3.create(0.4, 0.4, 1));
infoMenu.AdjustTextDisplay("displayInfo", "infoContent", 0, 2);
infoMenu.AdjustTextDisplay("displayInfo", "infoContent", 2, 0, 0);
infoMenu.GetMenuObjectText("displayInfo", "infoContent").width = 6;
infoMenu.GetMenuObjectText("displayInfo", "infoContent").textWrapping = true;