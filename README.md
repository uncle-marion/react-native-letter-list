# react-native-letter-list
A list of content sorted by letter

懒得写了，贴几段代码在这吧，自己看


可配置参数
```
{
  showSearch: props.showSearch || false,                      // 是否显示搜索框
  letterName: props.letterName || 'letter',                   // 列表中字母属性名称
  childListName: props.childListName || 'childList',          // 列表中子列表名称
  childTextName: props.childTextName || 'name',               // 子列表中需要显示的名称
  titleHeight: props.titleHeight || 36,                       // 字母行需要渲染的高度(列表高度计算)
  itemHeight: props.itemHeight || 44,                         // 列表项需要渲染的高度
  emptyText: props.emptyText || 'No Data',                    // 列表为空时需要渲染的文字
  placeholder: props.placeholder || 'Enter keywords to search', // 搜索框的占位
  list: props.list,                                           // list 接受的参数参考下面一段代码
}
```

接受的列表参数
```
[
  {
    letter: 'B',
    childList: [{
      name: '北京',
      id: '0001'
    }, {
      ...
    }]
  }, {
    ...
  }
]
```

调用代码
```
// 引入
import LetterList from 'react-native-letter-list';

...
// 点击列表项时的方法
outputCityInfo(cityInfo) {
  this.props.navigation.state.params.returnData(cityInfo);
  routes.pop(this.props.navigation);
}

...
<!-- jsx -->
<LetterList
  list={this.state.cityList}
  showSearch={true}
  sharchPlaceholder={'输入城市名字搜索'}
  emptyText={'暂无数据'}
  onSelect={this.outputCityInfo.bind(this)}
></LetterList>

```
