const ONE_DAY_SECONDS = 24*60*60;
const MAXIMUM_CALLERS_ALLOWED = 10;

const DEFAULT_TARGETED_ADDRESS = "0x407d73d8a49eeb85d32cf465507dd71d507100b1"
const DEFAULT_CALLER_ADDRESS = "0x407d73d8a49eeb85d32cf465507dd71d507100c0"

const ERC_20_APPROVE_FUNCTION = "function approve()";
const ERC_20_INCREASE_ALLOWANCE_FUNCTION = "function increaseAllowance()";

export { ONE_DAY_SECONDS, MAXIMUM_CALLERS_ALLOWED,
    ERC_20_APPROVE_FUNCTION, ERC_20_INCREASE_ALLOWANCE_FUNCTION,
    DEFAULT_CALLER_ADDRESS, DEFAULT_TARGETED_ADDRESS }