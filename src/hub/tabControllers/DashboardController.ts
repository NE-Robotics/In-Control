import { TabState } from "../../packages/utils/HubState";
import LogFieldTree from "../../packages/log/LogFieldTree";
import TabType from "../../packages/utils/TabType";
import { arraysEqual } from "../../packages/utils/util";
import TabController from "../TabController";

export default class DashboardController implements TabController {
  private NO_DATA_ALERT: HTMLElement;
  private TABLE_CONTAINER: HTMLElement;
  private TABLE_BODY: HTMLElement;

  private lastFieldList: string[] = [];

  private teleop = [32, 33, 48, 49];
  private autonomous = [34, 35, 50, 51];
  private test = [36, 37, 52, 53];

  private content: HTMLElement;

  constructor(content: HTMLElement) {
    this.content = content;
    this.NO_DATA_ALERT = content.getElementsByClassName("tab-centered")[0] as HTMLElement;
    this.TABLE_CONTAINER = content.getElementsByClassName("dashboard-table-containe")[0] as HTMLElement;
    this.TABLE_BODY = content.getElementsByClassName("dashboard-table")[0].firstElementChild as HTMLElement;
  }

  saveState(): TabState {
    return { type: TabType.Dashboard };
  }

  restoreState(state: TabState) {}

  periodic() {}

  refresh() {}
}
