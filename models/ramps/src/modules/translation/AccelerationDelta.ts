import Particle from '../../Particle';
import RampsModule from '../../RampsModule';
import RampsClock from '../../RampsClock';
import Vector3Curve from '../../helpers/Vector3Curve';
import TimeConversions from '../../helpers/TimeConversions';

class AccelerationDelta extends RampsModule {
    accelerationOverLife: Vector3Curve;

    constructor(
      accelerationOverLife: Vector3Curve,
      clock: RampsClock | undefined = undefined,
    ) {
      super(clock);

      this.accelerationOverLife = accelerationOverLife;
    }

    influence(particle: Particle): void {
      const time = TimeConversions.PercentCompletedParticleLife(this.clock.time, particle);

      particle.acceleration = this.accelerationOverLife.evaluate(time);
      particle.velocity.addScaledVector(particle.acceleration, this.clock.deltaTime);
      particle.position.addScaledVector(particle.velocity, this.clock.deltaTime * particle.speed);
    }

    setup(particle: Particle): void {
      particle.acceleration = this.accelerationOverLife.evaluate(0);
    }
}

export default AccelerationDelta;
