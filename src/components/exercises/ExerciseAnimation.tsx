"use client";

import { useId, ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimationType } from "@/lib/types";
import { animationConfigs, JointRange } from "./animationConfig";

interface ExerciseAnimationProps {
  animation: AnimationType;
  color: string;
  className?: string;
  /** "loop" (default) animates continuously. "start"/"end" freezes on one pose — used for before/after comparisons. */
  phase?: "loop" | "start" | "end";
  /** When true, only the muscle groups actually doing work are drawn in `color`; the rest of the body is neutral gray. */
  highlight?: boolean;
}

const NEUTRAL = "#AEB6C2";
type Phase = "loop" | "start" | "end";

function normalize(j: JointRange | undefined): { values: [number, number]; delay: number } {
  if (!j) return { values: [0, 0], delay: 0 };
  if (Array.isArray(j)) return { values: j, delay: 0 };
  return { values: j.v, delay: j.delay ?? 0 };
}

function isDynamic(j: JointRange | undefined): boolean {
  if (!j) return false;
  const { values } = normalize(j);
  return values[0] !== values[1];
}

// Base skeleton coordinates (standing pose), viewBox 140 x 155
const HEAD = { x: 70, y: 27, r: 10 };
const SHOULDER_L = { x: 57, y: 45 };
const SHOULDER_R = { x: 83, y: 45 };
const ELBOW_OFFSET = 23;
const HAND_OFFSET = 20;
const HIP_PIVOT = { x: 70, y: 87 };
const HIP_L = { x: 63, y: 89 };
const HIP_R = { x: 77, y: 89 };
const KNEE_OFFSET = 29;
const FOOT_OFFSET = 27;

interface LimbProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  color: string;
}

function Limb({ x1, y1, x2, y2, width, color }: LimbProps) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeOpacity={0.35} strokeWidth={width + 2.5} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#fff"
        strokeOpacity={0.3}
        strokeWidth={Math.max(1, width - 3)}
        strokeLinecap="round"
      />
    </>
  );
}

/** Rotates children around (originX, originY). Animates continuously in "loop" phase; otherwise renders a plain, deterministic static rotation — no reliance on motion keyframe quirks. */
function Rotator({
  joint,
  originX,
  originY,
  phase,
  duration,
  children,
  filter,
}: {
  joint: JointRange | undefined;
  originX: number;
  originY: number;
  phase: Phase;
  duration: number;
  children: ReactNode;
  filter?: string;
}) {
  const n = normalize(joint);
  if (phase === "loop") {
    return (
      <motion.g
        style={{ originX: `${originX}px`, originY: `${originY}px` }}
        animate={{ rotate: n.values }}
        transition={{ duration, delay: n.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        filter={filter}
      >
        {children}
      </motion.g>
    );
  }
  const angle = phase === "start" ? n.values[0] : n.values[1];
  return (
    <g transform={`rotate(${angle} ${originX} ${originY})`} filter={filter}>
      {children}
    </g>
  );
}

/** Translates children vertically. Same loop-vs-static split as Rotator. */
function Translator({
  joint,
  phase,
  duration,
  children,
  filter,
}: {
  joint: JointRange | undefined;
  phase: Phase;
  duration: number;
  children: ReactNode;
  filter?: string;
}) {
  const n = normalize(joint);
  if (phase === "loop") {
    return (
      <motion.g
        animate={{ y: n.values }}
        transition={{ duration, delay: n.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        filter={filter}
      >
        {children}
      </motion.g>
    );
  }
  const dy = phase === "start" ? n.values[0] : n.values[1];
  return (
    <g transform={`translate(0 ${dy})`} filter={filter}>
      {children}
    </g>
  );
}

export function ExerciseAnimation({ animation, color, className, phase = "loop", highlight = false }: ExerciseAnimationProps) {
  const uid = useId();
  const config = animationConfigs[animation];
  const { mode, duration, joints } = config;

  const bodyYDynamic = isDynamic(joints.bodyY);
  const armLActive = isDynamic(joints.shoulderL) || isDynamic(joints.elbowL);
  const armRActive = isDynamic(joints.shoulderR) || isDynamic(joints.elbowR);
  const legLActive = isDynamic(joints.hipL) || isDynamic(joints.kneeL) || bodyYDynamic;
  const legRActive = isDynamic(joints.hipR) || isDynamic(joints.kneeR) || bodyYDynamic;
  const torsoActive = isDynamic(joints.torso) || isDynamic(joints.upperBodyLift);

  const pick = (active: boolean) => (highlight ? (active ? color : NEUTRAL) : color);
  const armLColor = pick(armLActive);
  const armRColor = pick(armRActive);
  const legLColor = pick(legLActive);
  const legRColor = pick(legRActive);
  const torsoColor = pick(torsoActive);
  const headColor = highlight ? NEUTRAL : color;

  const joint = (cx: number, cy: number, r: number, jointColor: string) => (
    <circle cx={cx} cy={cy} r={r} fill={jointColor} stroke="#000" strokeOpacity={0.25} strokeWidth={1} />
  );

  // A soft "flexed muscle" bulge drawn over an active limb segment, so highlighted
  // limbs read as working muscle rather than just a colored line.
  const bulge = (x: number, yMid: number, side: 1 | -1, active: boolean) =>
    highlight && active && (
      <ellipse cx={x + side * 4.5} cy={yMid} rx={6.5} ry={8.5} fill={color} opacity={0.65} />
    );

  return (
    <svg viewBox="0 0 140 155" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`depth-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" in="SourceGraphic" result="shadowed" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="shadowed" />
          </feMerge>
        </filter>
      </defs>

      <g transform={mode === "lying" ? `rotate(90 ${HIP_PIVOT.x} 85)` : undefined}>
        <Translator joint={joints.bodyY} phase={phase} duration={duration} filter={`url(#depth-${uid})`}>
          {/* left leg */}
          <Rotator joint={joints.hipL} originX={HIP_L.x} originY={HIP_L.y} phase={phase} duration={duration}>
            <Limb x1={HIP_L.x} y1={HIP_L.y} x2={HIP_L.x} y2={HIP_L.y + KNEE_OFFSET} width={7} color={legLColor} />
            {bulge(HIP_L.x, HIP_L.y + KNEE_OFFSET / 2, -1, legLActive)}
            <Rotator joint={joints.kneeL} originX={HIP_L.x} originY={HIP_L.y + KNEE_OFFSET} phase={phase} duration={duration}>
              <Limb
                x1={HIP_L.x}
                y1={HIP_L.y + KNEE_OFFSET}
                x2={HIP_L.x}
                y2={HIP_L.y + KNEE_OFFSET + FOOT_OFFSET}
                width={6}
                color={legLColor}
              />
              {joint(HIP_L.x, HIP_L.y + KNEE_OFFSET + FOOT_OFFSET, 3.6, legLColor)}
            </Rotator>
            {joint(HIP_L.x, HIP_L.y + KNEE_OFFSET, 4, legLColor)}
          </Rotator>

          {/* right leg */}
          <Rotator joint={joints.hipR} originX={HIP_R.x} originY={HIP_R.y} phase={phase} duration={duration}>
            <Limb x1={HIP_R.x} y1={HIP_R.y} x2={HIP_R.x} y2={HIP_R.y + KNEE_OFFSET} width={7} color={legRColor} />
            {bulge(HIP_R.x, HIP_R.y + KNEE_OFFSET / 2, 1, legRActive)}
            <Rotator joint={joints.kneeR} originX={HIP_R.x} originY={HIP_R.y + KNEE_OFFSET} phase={phase} duration={duration}>
              <Limb
                x1={HIP_R.x}
                y1={HIP_R.y + KNEE_OFFSET}
                x2={HIP_R.x}
                y2={HIP_R.y + KNEE_OFFSET + FOOT_OFFSET}
                width={6}
                color={legRColor}
              />
              {joint(HIP_R.x, HIP_R.y + KNEE_OFFSET + FOOT_OFFSET, 3.6, legRColor)}
            </Rotator>
            {joint(HIP_R.x, HIP_R.y + KNEE_OFFSET, 4, legRColor)}
          </Rotator>

          {/* hip base joint */}
          {joint(HIP_PIVOT.x, HIP_PIVOT.y, 3, torsoColor)}

          {/* upper body (torso lean) */}
          <Rotator joint={joints.torso} originX={HIP_PIVOT.x} originY={HIP_PIVOT.y} phase={phase} duration={duration}>
            <Translator joint={joints.upperBodyLift} phase={phase} duration={duration}>
              {/* torso */}
              <polygon
                points={`${SHOULDER_L.x},${SHOULDER_L.y} ${SHOULDER_R.x},${SHOULDER_R.y} ${HIP_R.x},${HIP_R.y} ${HIP_L.x},${HIP_L.y}`}
                fill={torsoColor}
                opacity={0.92}
                stroke="#000"
                strokeOpacity={0.25}
                strokeWidth={1}
              />

              {/* left arm */}
              <Rotator joint={joints.shoulderL} originX={SHOULDER_L.x} originY={SHOULDER_L.y} phase={phase} duration={duration}>
                <Limb
                  x1={SHOULDER_L.x}
                  y1={SHOULDER_L.y}
                  x2={SHOULDER_L.x}
                  y2={SHOULDER_L.y + ELBOW_OFFSET}
                  width={5.5}
                  color={armLColor}
                />
                {bulge(SHOULDER_L.x, SHOULDER_L.y + ELBOW_OFFSET / 2, -1, armLActive)}
                <Rotator
                  joint={joints.elbowL}
                  originX={SHOULDER_L.x}
                  originY={SHOULDER_L.y + ELBOW_OFFSET}
                  phase={phase}
                  duration={duration}
                >
                  <Limb
                    x1={SHOULDER_L.x}
                    y1={SHOULDER_L.y + ELBOW_OFFSET}
                    x2={SHOULDER_L.x}
                    y2={SHOULDER_L.y + ELBOW_OFFSET + HAND_OFFSET}
                    width={5}
                    color={armLColor}
                  />
                  {joint(SHOULDER_L.x, SHOULDER_L.y + ELBOW_OFFSET + HAND_OFFSET, 3.4, armLColor)}
                </Rotator>
                {joint(SHOULDER_L.x, SHOULDER_L.y + ELBOW_OFFSET, 3, armLColor)}
              </Rotator>

              {/* right arm */}
              <Rotator joint={joints.shoulderR} originX={SHOULDER_R.x} originY={SHOULDER_R.y} phase={phase} duration={duration}>
                <Limb
                  x1={SHOULDER_R.x}
                  y1={SHOULDER_R.y}
                  x2={SHOULDER_R.x}
                  y2={SHOULDER_R.y + ELBOW_OFFSET}
                  width={5.5}
                  color={armRColor}
                />
                {bulge(SHOULDER_R.x, SHOULDER_R.y + ELBOW_OFFSET / 2, 1, armRActive)}
                <Rotator
                  joint={joints.elbowR}
                  originX={SHOULDER_R.x}
                  originY={SHOULDER_R.y + ELBOW_OFFSET}
                  phase={phase}
                  duration={duration}
                >
                  <Limb
                    x1={SHOULDER_R.x}
                    y1={SHOULDER_R.y + ELBOW_OFFSET}
                    x2={SHOULDER_R.x}
                    y2={SHOULDER_R.y + ELBOW_OFFSET + HAND_OFFSET}
                    width={5}
                    color={armRColor}
                  />
                  {joint(SHOULDER_R.x, SHOULDER_R.y + ELBOW_OFFSET + HAND_OFFSET, 3.4, armRColor)}
                </Rotator>
                {joint(SHOULDER_R.x, SHOULDER_R.y + ELBOW_OFFSET, 3, armRColor)}
              </Rotator>

              {/* head (drawn last so it sits above the arms/torso) */}
              {joint(HEAD.x, HEAD.y, HEAD.r, headColor)}
            </Translator>
          </Rotator>
        </Translator>
      </g>

      <ellipse cx={70} cy={150} rx={27} ry={4.5} fill="#000" opacity={0.3} />
    </svg>
  );
}
