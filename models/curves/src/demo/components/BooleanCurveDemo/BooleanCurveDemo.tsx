import React from 'react';
import './BooleanCurveDemo.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Curve } from '../../../..';
import CurveDemo from '../CurveDemo/CurveDemo';

function BooleanCurveDemo(): React.ReactElement {
  return (
    <CurveDemo <boolean>
      title="Boolean Curve Demo"
      curve={Curve.booleanBuilder(false, true, 10)}
      displayGenerator={
          (curve: Curve<boolean>, keys: { x: number, y: boolean }[]) => ({
            animationEnabled: true,
            theme: 'light2',
            title: {
              text: 'Curve Test',
            },
            axisY: {
              title: 'Value',
              includeZero: false,
            },
            axisX: {
              title: 'Time',
              interval: 1,
            },
            data: [
              {
                type: 'line',
                toolTipContent: 'Time {x}: {bool}',
                dataPoints: keys.map((key) => ({
                  x: key.x,
                  y: key.y ? 1 : 0,
                  markerType: 'none',
                  bool: key.y,
                })),
              },
              {
                type: 'scatter',
                toolTipContent: 'Time {x}: {bool}',
                dataPoints: curve.keys.map((key) => ({
                  x: key.time,
                  y: key.value ? 1 : 0,
                  color: 'lightblue',
                  bool: key.value,
                })),
              },
            ],
          })
      }
    />
  );
}

export default BooleanCurveDemo;
