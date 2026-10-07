import { AnimationType } from "@/lib/types";

export type JointRange = [number, number] | { v: [number, number]; delay?: number };

export interface JointSet {
  shoulderL?: JointRange;
  shoulderR?: JointRange;
  elbowL?: JointRange;
  elbowR?: JointRange;
  hipL?: JointRange;
  hipR?: JointRange;
  kneeL?: JointRange;
  kneeR?: JointRange;
  torso?: JointRange;
  bodyY?: JointRange;
  upperBodyLift?: JointRange;
}

export interface AnimationConfig {
  mode: "standing" | "lying";
  duration: number;
  joints: JointSet;
}

const cfg = (mode: AnimationConfig["mode"], duration: number, joints: JointSet): AnimationConfig => ({
  mode,
  duration,
  joints,
});

export const animationConfigs: Record<AnimationType, AnimationConfig> = {
  pushup: cfg("lying", 1.6, {
    shoulderL: [0, 15],
    shoulderR: [0, -15],
    elbowL: [0, -75],
    elbowR: [0, 75],
    bodyY: [0, 7],
  }),
  "press-horizontal": cfg("lying", 1.5, {
    shoulderL: [-60, -60],
    shoulderR: [60, 60],
    elbowL: [-110, -10],
    elbowR: [110, 10],
  }),
  fly: cfg("lying", 1.6, {
    shoulderL: [-15, -95],
    shoulderR: [15, 95],
    elbowL: [-15, -15],
    elbowR: [15, 15],
  }),
  pullover: cfg("lying", 1.8, {
    shoulderL: [-5, -165],
    shoulderR: [5, 165],
    elbowL: [-15, -15],
    elbowR: [15, 15],
  }),
  pulldown: cfg("standing", 1.6, {
    shoulderL: [-160, -70],
    shoulderR: [160, 70],
    elbowL: [0, -80],
    elbowR: [0, 80],
    torso: [0, 6],
  }),
  row: cfg("standing", 1.5, {
    torso: [34, 34],
    shoulderL: [40, -30],
    elbowL: [0, -100],
  }),
  "press-overhead": cfg("standing", 1.5, {
    shoulderL: [-80, -170],
    shoulderR: [80, 170],
    elbowL: [-90, -10],
    elbowR: [90, 10],
  }),
  "raise-lateral": cfg("standing", 1.5, {
    shoulderL: [0, -90],
    shoulderR: [0, 90],
    elbowL: [-10, -10],
    elbowR: [10, 10],
  }),
  "raise-front": cfg("standing", 1.5, {
    shoulderL: [0, -90],
    elbowL: [-10, -10],
  }),
  "upright-row": cfg("standing", 1.4, {
    shoulderL: [10, -40],
    shoulderR: [-10, 40],
    elbowL: [0, -120],
    elbowR: [0, 120],
  }),
  "face-pull": cfg("standing", 1.4, {
    torso: [0, -5],
    shoulderL: [20, -60],
    shoulderR: [-20, 60],
    elbowL: [0, -100],
    elbowR: [0, 100],
  }),
  shrug: cfg("standing", 1.2, {
    upperBodyLift: [0, -6],
  }),
  curl: cfg("standing", 1.4, {
    shoulderL: [-10, -10],
    shoulderR: [10, 10],
    elbowL: [0, -130],
    elbowR: [0, 130],
  }),
  "curl-unilateral": cfg("standing", 1.4, {
    shoulderL: [-10, -10],
    elbowL: [0, -130],
  }),
  dip: cfg("standing", 1.5, {
    shoulderL: [25, 25],
    shoulderR: [-25, -25],
    elbowL: [0, -90],
    elbowR: [0, 90],
    bodyY: [0, 9],
  }),
  "extension-triceps": cfg("standing", 1.5, {
    shoulderL: [-170, -170],
    shoulderR: [170, 170],
    elbowL: [-150, -20],
    elbowR: [150, 20],
  }),
  pushdown: cfg("standing", 1.3, {
    shoulderL: [15, 15],
    shoulderR: [-15, -15],
    elbowL: [-90, 10],
    elbowR: [90, -10],
  }),
  kickback: cfg("standing", 1.4, {
    torso: [42, 42],
    shoulderL: [18, 18],
    elbowL: [-90, 0],
  }),
  squat: cfg("standing", 1.6, {
    bodyY: [0, 16],
    torso: [0, 10],
    kneeL: [0, 38],
    kneeR: [0, -38],
  }),
  "leg-press": cfg("standing", 1.6, {
    bodyY: [0, 10],
    kneeL: [0, 55],
    kneeR: [0, -55],
  }),
  legcurl: cfg("lying", 1.4, {
    kneeL: [0, -95],
    kneeR: [0, 95],
  }),
  "leg-extension": cfg("standing", 1.4, {
    hipL: [60, 60],
    hipR: [-60, -60],
    kneeL: [90, 5],
    kneeR: [-90, -5],
  }),
  "calf-raise": cfg("standing", 1.1, {
    bodyY: [0, -6],
  }),
  stretch: cfg("lying", 2.6, {
    hipL: [0, -22],
  }),
  plank: cfg("lying", 2.4, {
    torso: [0, 2],
  }),
  "leg-raise": cfg("lying", 1.6, {
    hipL: [0, -80],
    hipR: [0, -80],
  }),
  "knee-tuck": cfg("lying", 1.5, {
    torso: [18, 18],
    hipL: [15, -55],
    hipR: [15, -55],
    kneeL: [0, -95],
    kneeR: [0, -95],
  }),
  "reverse-crunch": cfg("lying", 1.5, {
    hipL: [0, -65],
    hipR: [0, -65],
    kneeL: [80, 80],
    kneeR: [80, 80],
  }),
  crunch: cfg("standing", 1.4, {
    torso: [0, 32],
    shoulderL: [60, 60],
    shoulderR: [-60, -60],
    elbowL: [-20, -20],
    elbowR: [20, 20],
  }),
  "cable-crunch": cfg("standing", 1.4, {
    torso: [0, 36],
    kneeL: [95, 95],
    kneeR: [-95, -95],
    shoulderL: [-150, -150],
    shoulderR: [150, 150],
    elbowL: [25, 25],
    elbowR: [-25, -25],
  }),
  "high-knees": cfg("standing", 0.55, {
    bodyY: [0, -8],
    hipL: [0, -95],
    hipR: { v: [0, -95], delay: 0.275 },
    kneeL: [85, 15],
    kneeR: { v: [85, 15], delay: 0.275 },
    shoulderL: { v: [20, -55], delay: 0.275 },
    shoulderR: [20, -55],
  }),
  jump: cfg("standing", 0.85, {
    bodyY: [0, -14],
    hipL: [0, 28],
    hipR: [0, -28],
    shoulderL: [0, -160],
    shoulderR: [0, 160],
  }),
  walk: cfg("standing", 1.0, {
    bodyY: [0, -3],
    hipL: [-22, 20],
    hipR: { v: [-22, 20], delay: 0.5 },
    kneeL: [0, -30],
    kneeR: { v: [0, -30], delay: 0.5 },
    shoulderL: { v: [20, -22], delay: 0.5 },
    shoulderR: [20, -22],
  }),
};
