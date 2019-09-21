# react-native-letter-list

A list of content sorted by letter

## Install
```npm i -S react-native-letter-list```

## Usage
```
import LetterList from 'react-native-letter-list';

...
outputCityInfo(cityInfo) {
  // You Code
}

...
<!-- jsx -->
<LetterList
  list={array}                    // section list
  onSelect={(item) => {}}         // select callback

  // These properties are optional
  showSearch = {boolean},         // default: false
  placeholder = {string},         // default: Enter keywords to search
  letterName = {string},          // default: letter         show to in section header
  titleHeight = {number},         // default: 36             section header
  childListName = {string},       // default: childList      section list name
  childTextName = {string},       // default: name           item content
  itemHeight = {number}           // default: 44,            item height
  emptyText = {string}            // default: No Data        display when the list is empty

></LetterList>

```

## List Sample
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