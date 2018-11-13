# MapTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

# 目前存在的问题
1、历史轨迹表格：如果查询日期范围内无数据就执行不到历史轨迹组件渲染这一步，即没有表格。\n
2、历史轨迹点：有的误差很大的点需要除去
3、地图中心点不在坐标:如果先选中实时位置再点击地图坐标就在中心，如果先实时数据就不在中心。
4、css:表格查询部分不同浏览器中显示不一样，可能会错乱

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
