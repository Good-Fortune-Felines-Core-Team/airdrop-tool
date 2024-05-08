enum ExitCodeEnum {
  Success,
  UnknownError,
  InvalidAccountID,
  AccountNotKnown,
  DirectoryReadError,
  DirectoryWriteError,
  FileReadError,
  FileWriteError,
  InsufficientFundsError,
}

export default ExitCodeEnum;
