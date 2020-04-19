import EndBehavior from './EndBehavior';
import Keyframe from './keyframes/Keyframe';
import Easing from './Easing';
import FloatKeyframe from './keyframes/FloatKeyframe';
import { RGBColor } from './interfaces/RGBColor';
import RGBColorKeyframe from './keyframes/RGBColorKeyframe';
import { Vector3 } from './interfaces/Vector3';
import Vector3Keyframe from './keyframes/Vector3Keyframe';
import HSVColorKeyframe from './keyframes/HSVColorKeyframe';
import { HSVColor } from './interfaces/HSVColor';
import ListKeyframe from './keyframes/ListKeyframe';
import ObjectKeyframe from './keyframes/ObjectKeyframe';

class Curve<T> {
    static increaseFloat: Curve<number> = Curve.floatBuilder(0, 1);
    static decreaseFloat: Curve<number> = Curve.floatBuilder(1, 0);

    static increaseColor: Curve<RGBColor> = Curve.rgbColorBuilder(
      { r: 0, b: 0, g: 0 },
      { r: 255, b: 255, g: 255 },
    );
    static decreaseColor: Curve<RGBColor> = Curve.rgbColorBuilder(
      { r: 255, b: 255, g: 255 },
      { r: 0, b: 0, g: 0 },
    );


    keys: Keyframe<T>[];

    endBehaviour: EndBehavior;

    startTime = 0;
    endTime = 0;
    duration = 0;

    constructor(keys: Keyframe<T>[] = [], endBehavior: EndBehavior = EndBehavior.Clamp) {
      this.keys = keys;
      this.endBehaviour = endBehavior;

      this._calculateBounds();
    }

    // Add a keyframe
    addKeyframe(keyframe: Keyframe<T>): void {
      this.keys.push(keyframe);
      this._calculateBounds();
    }

    // Evaluate the curve at a specific time
    evaluate(time: number): T {
      if (this.startTime <= time && time <= this.endTime) {
        return this._rangeEvaluate(time);
      }

      switch (this.endBehaviour) {
        case EndBehavior.Clamp:
          if (this.startTime > time) {
            return this._rangeEvaluate(this.startTime); // First keyframe
          }

          return this._rangeEvaluate(this.endTime); // Last keyframe

        case EndBehavior.Loop:
          return this._rangeEvaluate(time % this.endTime); // Use mod to loop

        case EndBehavior.PingPong:
          return this._rangeEvaluate(this._pingPongTime(time));

        default:
          return this._rangeEvaluate(0); // Unreachable
      }
    }

    // Time is guaranteed to be in curve range
    protected _rangeEvaluate(time: number): T {
      // Edge cases
      if (time === this.startTime) return this.keys[0].value;
      if (time === this.endTime) return this.keys[this.keys.length - 1].value;

      let index = 0;
      let found = false;

      for (let i = 0; i < this.keys.length && !found; i += 1) {
        if (time <= this.keys[i].time) {
          found = true;
          index = i;
        }
      }

      return this.keys[index - 1].interpolateRealtime(this.keys[index], time);
    }

    // Get start & end time of curve
    protected _calculateBounds(): void {
      this.keys.sort((k1, k2) => k1.time - k2.time);

      if (this.keys.length > 0) {
        this.startTime = this.keys[0].time;
        this.endTime = this.keys[this.keys.length - 1].time;
        this.duration = this.endTime - this.startTime;
      } else {
        this.startTime = 0;
        this.endTime = 0;
        this.duration = 0;
      }
    }

    // Calculate ping-ponged time
    protected _pingPongTime(time: number) {
      return Math.abs(
        -((time - this.duration) % (2 * this.duration)) + this.duration,
      );
    }

    static builder<T>(
      KeyframeType: new (time: number, value: T, easing: Easing) => Keyframe<T>,
      inValue: T,
      outValue: T,
      duration = 1,
      easing = Easing.cubic,
    ): Curve<T> {
      return new Curve<T>([
        new KeyframeType(0, inValue, easing),
        new KeyframeType(duration, outValue, easing),
      ]);
    }

    static floatBuilder(inValue: number, outValue: number, duration = 1, easing: Easing = Easing.cubic): Curve<number> {
      return Curve.builder<number>(FloatKeyframe, inValue, outValue, duration, easing);
    }

    static rgbColorBuilder(inValue: RGBColor, outValue: RGBColor, duration = 1, easing: Easing = Easing.cubic): Curve<RGBColor> {
      return Curve.builder<RGBColor>(RGBColorKeyframe, inValue, outValue, duration, easing);
    }

    static hsvColorBuilder(inValue: HSVColor, outValue: HSVColor, duration = 1, easing: Easing = Easing.cubic): Curve<HSVColor> {
      return Curve.builder<HSVColor>(HSVColorKeyframe, inValue, outValue, duration, easing);
    }

    static vector3Builder(inValue: Vector3, outValue: Vector3, duration = 1, easing: Easing = Easing.cubic): Curve<Vector3> {
      return Curve.builder<Vector3>(Vector3Keyframe, inValue, outValue, duration, easing);
    }

    static listBuilder(inValue: number[], outValue: number[], duration = 1, easing: Easing = Easing.cubic): Curve<number[]> {
      return Curve.builder<number[]>(ListKeyframe, inValue, outValue, duration, easing);
    }

    static objectBuilder(inValue: object, outValue: object, duration = 1, easing: Easing = Easing.cubic): Curve<object> {
      return Curve.builder<object>(ObjectKeyframe, inValue, outValue, duration, easing);
    }
}

export default Curve;