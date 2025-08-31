import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';
import { kmsToMinutesBySpeed } from 'src/_libs/utils/common';
import { Point } from 'src/_libs/utils/helper/point-helper';

export class GpsPoint {
  @ApiProperty({ description: '經度' })
  @IsLongitude()
  lng!: number;

  @ApiProperty({ description: '緯度' })
  @IsLatitude()
  lat!: number;

  toString(): string {
    return `[${this.lng}, ${this.lat}]`;
  }

  isEqual(other: GpsPoint): boolean {
    return GpsPoint.isEqual(this, other);
  }

  toPoint(): Point {
    return [this.lng, this.lat];
  }

  // Ref: [Accuracy of Decimal Places in Latitude and Longitude Degrees](https://support.garmin.com/en-US/?faq=hRMBoCTy5a7HqVkxukhHd8)
  // 1.0 degrees = 111 kms
  static degreesToKms(d: number): number {
    return d * 111;
  }

  static estimateTripKms(aGps: GpsPoint, bGps: GpsPoint): number {
    return this.degreesToKms(
      Math.abs(aGps.lng - bGps.lng) + Math.abs(aGps.lat - bGps.lat),
    );
  }

  static estimateTripsKms(ps: GpsPoint[]): number[] {
    if (ps.length < 2) return [];

    let prevGps = ps[0];
    return ps.slice(1).map((gps) => {
      const tripKms = this.estimateTripKms(prevGps, gps);
      prevGps = gps;
      return tripKms;
    });
  }

  static estimateTripMinutes(
    aGps: GpsPoint,
    bGps: GpsPoint,
    speedInKmsPerHour: number = 25,
  ): number {
    const tripInKm = this.estimateTripKms(aGps, bGps);
    return kmsToMinutesBySpeed(tripInKm, speedInKmsPerHour);
  }

  static isEqual(a: GpsPoint, b: GpsPoint): boolean {
    return a.lng == b.lng && a.lat == b.lat;
  }
}
