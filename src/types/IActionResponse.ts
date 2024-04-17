// types
import { ExitCodeEnum } from '@app/enums';

interface IActionResponse {
  completedTransfers: Record<string, string>;
  exitCode: ExitCodeEnum;
  failedTransfers: Record<string, string>;
}

export default IActionResponse;
