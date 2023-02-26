# NT4 Configurable Subscriptions

_[< Return to homepage](/docs/INDEX.md)_

Configurable subscribers using an imported json file.

## JSON Setup

### Getting from the robot

Subscriptions are represented as an array of values that defines what they get from the networktables and when.

The first element is a string which is either the full string of the network table value you want or the start of it if you have prefix mode set to true.

The second element is a boolean for prefix mode, in which case you only have to include the base of your string (ex. "/FMSInfo/" should subscribe to all FMSInfo substrings).

The third element is a boolean for sendAll, if set to true it will send every value the network table has stored for it, when set to false it only sends the most recent value.

The last element is a number for the update Rate, measured in seconds and determines how often data is updated. Setting this to a larger value will result in slower updates but also less data use. When handling hundreds of values it will help to alleviate slow downs and latency spikes.

### Pushing to the robot

Publishers are represented as an array where the first element is a string, which is the **full** path of the topic you want to publish.

The second string is the type of data you will be sending.
Valid data types:

```
boolean, double, int, float, string, json, raw, rpc, msgpack, protobuf, boolean[], double[], int[], float[], string[]
```

### Example config

```json
{
  "version":"0.1.3",
  "keys":[
    ["/DataString/Substring",bool,bool,Update Rate],
    ["/FMSInfo/FMSControlData", false, false, 2],
    ["/FMSInfo/IsRedAlliance", false, false, 0.1],
    ["/SmartDashboard/vision-main/EstTargetPoses3d", false, false, 0.02],
    ["/SmartDashboard/vision-main/RobotPose3d", false, false, 0.02]
  ],
  "publishers": [
    ["/DataString/Substring","type"],
    ["/SmartDashboard/TargetLocation","double[]"],
  ]
}
```

## Usage

To switch to NT4 Configurable mode, click "Options" > "Preferences" > "Live Mode" & select "NetworkTables 4 (Configurable)", then click the check mark.
Once you've made your config, click "File" > "Import NT4 Config..." & then select your config json. It will save after you've loaded it once but you can overwrite it by importing a new config.

## Current Integrated Publishers

```json
{
  "publishers": [
    ["/SmartDashboard/TargetLocation", "double[]"],
    ["/SmartDashboard/NavType", "string"],
    ["/SmartDashboard/ScoringNodes", "boolean[]"],
    ["/SmartDashboard/TargetNode", "double"]
  ]
}
```

- /SmartDashboard/TargetLocation : click location when capslock is on
- /SmartDashboard/NavType : "click" or "hotkey"
- /SmartDashboard/ScoringNodes : 27 booleans in an array from top left to bottom right of scoring nodes, togglable for trtackibng scoring and adding scoring data from robot or to signal which pieces have been scored to your robot
- /SmartDashboard/TargetNode : The selected node in the Scoring Nodes tab
