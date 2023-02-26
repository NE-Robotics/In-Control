import { TabState } from "../../packages/utils/HubState";
import TabType from "../../packages/utils/TabType";
import TabController from "../TabController";
import { getIsRedAlliance, getEnabledData, getFMSControlData } from "../../packages/log/LogUtil";

export default class DashboardController implements TabController {
  private VIDEO_CONTAINER: HTMLElement;
  private SOURCE_SELECTOR: HTMLInputElement;
  private port: string | undefined;

  private teleop = [32, 33, 48, 49];
  private autonomous = [34, 35, 50, 51];
  private test = [36, 37, 52, 53];

  private content: HTMLElement;
  constructor(content: HTMLElement) {
    this.content = content;
    this.VIDEO_CONTAINER = content.getElementsByClassName("dashboard-video-container")[0] as HTMLElement;
    this.SOURCE_SELECTOR = content.getElementsByClassName("dashboard-video-source-selector")[0] as HTMLInputElement;
    this.SOURCE_SELECTOR.addEventListener("change", () => {
      this.port = this.SOURCE_SELECTOR.value;
      this.connectStream(this.port);
    });
    // Cam Handle
    this.connectStream(this.port ?? "1181");
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
  }

  connectStream(port: string) {
    console.log("Connecting to stream on port " + port);
    if (window.preferences?.dashboardMode == "sim") {
      this.VIDEO_CONTAINER.setAttribute("src", "http://127.0.0.1:" + port + "/stream.mjpg");
    } else if (window.preferences?.dashboardMode == "real") {
      this.VIDEO_CONTAINER.setAttribute(
        "src",
        "http://" + window.preferences?.rioAddress + ":" + port + "/stream.mjpg"
      );
    } else {
      this.VIDEO_CONTAINER.style.display = "none";
    }
  }
}
