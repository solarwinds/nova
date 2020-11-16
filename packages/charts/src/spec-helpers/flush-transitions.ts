import { timerFlush } from "d3-timer";
/** @ignore */
export function flushAllD3Transitions() {
    const now = performance.now;
    performance.now = () => Infinity;
    timerFlush();
    performance.now = now;
}
