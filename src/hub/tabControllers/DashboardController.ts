import { TabState } from "../../packages/utils/HubState";
import LogFieldTree from "../../packages/log/LogFieldTree";
import TabType from "../../packages/utils/TabType";
import { arraysEqual } from "../../packages/utils/util";
import TabController from "../TabController";
import LogField from "../../packages/log/LogField";
import getBoolean from "../../packages/log/Log";
import { getIsRedAlliance, getEnabledData, getFMSControlData } from "../../packages/log/LogUtil";

export default class DashboardController implements TabController {
  private NO_DATA_ALERT: HTMLElement;
  private TABLE_CONTAINER: HTMLElement;
  private TABLE_BODY: HTMLElement;
  private VIDEO_CONTAINER: HTMLElement;

  private fields: { [id: string]: LogField } = {};

  private teleop = [32, 33, 48, 49];
  private autonomous = [34, 35, 50, 51];
  private test = [36, 37, 52, 53];
  private FMSConnected = [0, 1, 16, 17];

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

  periodic() {}

  refresh() {
    // FMS Table Handle
    // allaince
    if (getIsRedAlliance(window.log)) {
      this.content.getElementsByClassName("AllainceColour")[0].innerHTML = "Red";
    } else {
      this.content.getElementsByClassName("AllainceColour")[0].innerHTML = "Blue";
    }
    // mode
    let FMSControlData = getFMSControlData(window.log);
    if (this.teleop.includes(FMSControlData)) {
      if (FMSControlData % 2 == 0) {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Teleop Disabled";
      } else {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Teleop Enabled";
      }
    } else if (this.autonomous.includes(FMSControlData)) {
      if (FMSControlData % 2 == 0) {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Autonomous Disabled";
      } else {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Autonomous Enabled";
      }
    } else if (this.test.includes(FMSControlData)) {
      if (FMSControlData % 2 == 0) {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Test Disabled";
      } else {
        this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Test Enabled";
      }
    } else {
      this.content.getElementsByClassName("CurrentMode")[0].innerHTML = "Unknown";
    }
    // FMS connected
    if (FMSControlData > 47) {
      this.content.getElementsByClassName("CurrentMode")[0].innerHTML += " (FMS)";
      this.content.getElementsByClassName("isFMSConnected")[0].innerHTML = "True";
    } else {
      this.content.getElementsByClassName("isFMSConnected")[0].innerHTML = "False";
    }

    // Cam Handle
    if (window.preferences?.dashboardMode == "sim") {
      this.VIDEO_CONTAINER.setAttribute("src", "http://127.0.0.1:1181/stream.mjpg");
    } else if (window.preferences?.dashboardMode == "real") {
      this.VIDEO_CONTAINER.setAttribute("src", "http://" + window.preferences?.rioAddress + ":1181/stream.mjpg");
    } else {
      this.VIDEO_CONTAINER.style.display = "none";
    }
  }
}
