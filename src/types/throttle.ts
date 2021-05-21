export type SetDelayThrottle = {
  type: string,
  value: number
}

export type RandomDelayThrottle = {
  type: string,
  min: number,
  max: number
}

export type TimeoutThrottle = {
  type: string
}

type Throttle = SetDelayThrottle | RandomDelayThrottle | TimeoutThrottle;

export default Throttle;
