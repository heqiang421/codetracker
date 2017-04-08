import {Component, ViewChild, ElementRef} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ApiService} from "../../providers/api.service";
import * as echarts from "echarts";
/*
 Generated class for the Stats page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html'
})
export class StatsPage {

    range: string;
    @ViewChild('languagesUsed') languagesUsed: ElementRef;//使用语言
    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiService) {
        this.range = this.navParams.get('range');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StatsPage');
        this.apiService.getStats(this.range).subscribe(res => {
            console.log(res);
            this.initLanguageUsed(res.data.languages);
        });
    }


    initLanguageUsed(languages:Array<any>):void {
        let container = this.languagesUsed.nativeElement;
        let myChart = echarts.init(container);
        let option = {
            title: {
                text: 'Languages',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        for(let item of languages){
            option.series[0].data.push({value:item['total_seconds'],name:item['name']});
            option.legend.data.push(item['name']);
        }


        myChart.setOption(option);
    }


}
