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
  InvalidArguments,
}

export default ExitCodeEnum;
