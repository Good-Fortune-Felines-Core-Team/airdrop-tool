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
  InsufficientTokensError,
}

export default ExitCodeEnum;
