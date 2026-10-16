import { basename } from "node:path";
import { fileURLToPath } from "node:url";

type LogType = "INFO" | "ERROR" | "ADVERTENCIA" | "DEBUG";

export function cLog(type: LogType, text: string, errorObj?: unknown) {
  const stack = new Error();
  Error.captureStackTrace(stack, cLog);
  const callerFrame = stack.stack?.split("\n")[1]?.trim().replace(/^at\s+/, "");
  const callerPath = callerFrame?.match(/(?:\(|^)(.*):\d+:\d+\)?$/)?.[1];
  const scriptName = callerPath ? basename(callerPath.startsWith("file:") ? fileURLToPath(callerPath) : callerPath) : "unknown";

  switch (type) {
    case "INFO":
      console.info(`\x1b[96m|INF \x1b[92m${scriptName}> \x1b[0m${text}`);
      break;
    case "ERROR":
      console.error(`\x1b[91m|ERR \x1b[92m${scriptName}> \x1b[0m${text}`);
      if (errorObj) console.error(errorObj);
      break;
    case "ADVERTENCIA":
      console.warn(`\x1b[93m|ADV \x1b[92m${scriptName}> \x1b[0m${text}`);
      break;
    case "DEBUG":
    default:
      console.log(`\x1b[97m|DEB \x1b[92m${scriptName}> \x1b[0m${text}`);
      break;
  }
}
