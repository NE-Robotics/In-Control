import { TabState } from "../../packages/utils/HubState";
import LogFieldTree from "../../packages/log/LogFieldTree";
import TabType from "../../packages/utils/TabType";
import { arraysEqual } from "../../packages/utils/util";
import TabController from "../TabController";
import LogField from "../../packages/log/LogField";
import getBoolean from "../../packages/log/Log";

export default class DashboardController implements TabController {
  private NO_DATA_ALERT: HTMLElement;
  private TABLE_CONTAINER: HTMLElement;
  private TABLE_BODY: HTMLElement;
  private VIDEO_CONTAINER: HTMLElement;

  private fields: { [id: string]: LogField } = {};

  private teleop = [32, 33, 48, 49];
  private autonomous = [34, 35, 50, 51];
  private test = [36, 37, 52, 53];

  private isRed: any;

  private key: any;

  private content: HTMLElement;

  constructor(content: HTMLElement) {
    this.content = content;
    this.NO_DATA_ALERT = content.getElementsByClassName("tab-centered")[0] as HTMLElement;
    this.TABLE_CONTAINER = content.getElementsByClassName("dashboard-table-container")[0] as HTMLElement;
    this.TABLE_BODY = content.getElementsByClassName("dashboard-table")[0].firstElementChild as HTMLElement;
    this.VIDEO_CONTAINER = content.getElementsByClassName("dashboard-video-container")[0] as HTMLElement;
  }

  saveState(): TabState {
    return { type: TabType.Dashboard };
  }

  restoreState(state: TabState) {}

  periodic() {
    if (window.log.getFieldCount() != 0) {
      this.key = window.log.getFieldTree()["FMSInfo"].children["IsRedAlliance"].fullKey;
      if (this.key != null) {
        this.isRed = window.log.getBoolean(this.key, 0, 0);
      }
      if (this.isRed.values[0] == true) {
        this.content.getElementsByClassName("AllainceColour")[0].innerHTML = "Red";
      } else {
        this.content.getElementsByClassName("AllainceColour")[0].innerHTML = "Blue";
      }
    }
  }

  refresh() {
    let IP = null;
    if (window.preferences?.dashboardMode == "sim") {
      IP = "localhost";
    } else if (window.preferences?.dashboardMode == "real") {
      IP = window.preferences?.rioAddress;
    } else {
      // none
      this.VIDEO_CONTAINER.style.display = "none";
    }
    this.VIDEO_CONTAINER.setAttribute("src", "http://" + window.preferences?.rioAddress + ":1181/stream.mjpg");
  }
}
