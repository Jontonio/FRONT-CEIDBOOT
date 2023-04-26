import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {

  multi: any[] = [
    {
      "name": "Lithuania",
      "series": [
        {
          "value": 5909,
          "name": "2016-09-14T04:42:25.016Z"
        },
        {
          "value": 6980,
          "name": "2016-09-12T23:21:37.434Z"
        },
        {
          "value": 5423,
          "name": "2016-09-13T14:00:00.183Z"
        },
        {
          "value": 2649,
          "name": "2016-09-16T13:23:35.441Z"
        },
        {
          "value": 5327,
          "name": "2016-09-23T06:37:27.910Z"
        }
      ]
    },
    {
      "name": "Armenia",
      "series": [
        {
          "value": 2810,
          "name": "2016-09-14T04:42:25.016Z"
        },
        {
          "value": 6192,
          "name": "2016-09-12T23:21:37.434Z"
        },
        {
          "value": 2383,
          "name": "2016-09-13T14:00:00.183Z"
        },
        {
          "value": 6949,
          "name": "2016-09-16T13:23:35.441Z"
        },
        {
          "value": 5785,
          "name": "2016-09-23T06:37:27.910Z"
        }
      ]
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "series": [
        {
          "value": 5997,
          "name": "2016-09-14T04:42:25.016Z"
        },
        {
          "value": 6180,
          "name": "2016-09-12T23:21:37.434Z"
        },
        {
          "value": 4463,
          "name": "2016-09-13T14:00:00.183Z"
        },
        {
          "value": 2128,
          "name": "2016-09-16T13:23:35.441Z"
        },
        {
          "value": 5156,
          "name": "2016-09-23T06:37:27.910Z"
        }
      ]
    },
    {
      "name": "Portugal",
      "series": [
        {
          "value": 4779,
          "name": "2016-09-14T04:42:25.016Z"
        },
        {
          "value": 6907,
          "name": "2016-09-12T23:21:37.434Z"
        },
        {
          "value": 5507,
          "name": "2016-09-13T14:00:00.183Z"
        },
        {
          "value": 4092,
          "name": "2016-09-16T13:23:35.441Z"
        },
        {
          "value": 6398,
          "name": "2016-09-23T06:37:27.910Z"
        }
      ]
    },
    {
      "name": "Nepal",
      "series": [
        {
          "value": 4430,
          "name": "2016-09-14T04:42:25.016Z"
        },
        {
          "value": 6893,
          "name": "2016-09-12T23:21:37.434Z"
        },
        {
          "value": 3350,
          "name": "2016-09-13T14:00:00.183Z"
        },
        {
          "value": 5311,
          "name": "2016-09-16T13:23:35.441Z"
        },
        {
          "value": 3868,
          "name": "2016-09-23T06:37:27.910Z"
        }
      ]
    }
  ]
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    Object.assign(this, { multi:this.multi });
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
