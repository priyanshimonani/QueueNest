import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  repeat = false,
  repeatDelay = 0,
  onStart,
  onEnd
}) {
  const ref = useRef(null);
  const [cycle, setCycle] = useState(0);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / Math.max(duration, 0.01));
  const stiffness = 100 * (1 / Math.max(duration, 0.01));

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });

  const isInView = useInView(ref, { once: !repeat, margin: "0px" });

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals, 10) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest) => {
      const hasDecimals = maxDecimals > 0;
      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };
      const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue, cycle]);

  useEffect(() => {
    if (!isInView || !startWhen) {
      return undefined;
    }

    const initialValue = direction === "down" ? to : from;
    const targetValue = direction === "down" ? from : to;

    motionValue.set(initialValue);
    if (ref.current) {
      ref.current.textContent = formatValue(initialValue);
    }

    if (typeof onStart === "function") onStart();

    const timeoutId = setTimeout(() => {
      motionValue.set(targetValue);
    }, delay * 1000);

    const endTimeoutId = setTimeout(() => {
      if (typeof onEnd === "function") onEnd();
      if (repeat) {
        motionValue.set(initialValue);
        if (ref.current) {
          ref.current.textContent = formatValue(initialValue);
        }

        setTimeout(() => {
          setCycle((value) => value + 1);
        }, repeatDelay * 1000);
      }
    }, delay * 1000 + duration * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(endTimeoutId);
    };
  }, [
    cycle,
    delay,
    direction,
    duration,
    from,
    isInView,
    motionValue,
    onEnd,
    onStart,
    repeat,
    repeatDelay,
    startWhen,
    to
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
