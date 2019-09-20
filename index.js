'use strict';

// I'm Sorry, I have been busy recently, and the code will be optimized later…

import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  SectionList,
  TouchableOpacity,
} from 'react-native';

const config = {
  letterName: 'letter',
  dataName:   'childList',
  textName:   'name',
  titleHeight: 36,
  itemHeight:  44,
  placeholder: 'Enter keywords to search',
  emptyText:   'no data',
}

export default function ReactNativeLetterList(props) {
  // Each time a list of raw data is saved in response to filter events in the search box
  const originList = props.list;

  const {
    letterName,
    dataName,
    textName,
    titleHeight,
    itemHeight,
    placeholder,
    emptyText,
  } = {
    ...config,
    ...props,
  };

  const listRef = useRef(null);

  const [sectionList, setList] = useState([]);
  const [filterKey, setFilterKey] = useState('');
  const [clearVisible, changeVisible] = useState(false);
  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    filterOriginList('');
  }, [originList]);

  function filterOriginList(key = '') {
    const sections = [];
    const layouts = [];
    
    let offsetTop = 0;
    let total = 0;

    originList.map(item => {
      const data = !key ? item[dataName] : item[dataName].filter(item => item[textName].includes(key));
      if (data.length) {
        sections.push({
          title: item[letterName],
          data,
        });
        // Temporary use, and later extraction
        layouts.push({
          length: titleHeight,
          offset: offsetTop,
          index: total,
        });
        offsetTop += titleHeight;
        total += 1;
        data.map(() => {
          layouts.push({
            length: itemHeight,
            offset: offsetTop,
            index: total,
          });
          offsetTop += itemHeight + .5;
          total += 1;
        });
        layouts.push({
          length: 0,
          offset: offsetTop,
          index: total,
        });
        offsetTop -= .5;
        total += 1;
      }
    });
    setLayouts(layouts);
    setList(sections);
  }

  function renderLetterList() {
    const itemHeight = 26 - sectionList.length + (isFullScreen ? 20 : 18);
    const listHeight = itemHeight * sectionList.length;
    const listTop = (screenHeight - listHeight) / 2 * .6;
    return (
      <View style={styles.sideRight}>
        <View style={{
          ...styles.touchLetterList,
          marginTop: listTop,
          height: listHeight,
        }}>
          {
            sectionList.map((item, index) => {
              return item.title ? (
                <TouchableOpacity
                  style={{height: itemHeight}}
                  key={index}
                  activeOpacity={0.75}
                  onPressIn={() => {
                    scrollTo(index);
                  }}
                >
                  <Text style={styles.touchLetter}>{item.title}</Text>
                </TouchableOpacity>
              ) : null;
            })
          }
        </View>
      </View>
    );
  }

  function filterList(key) {
    setFilterKey(key);
    filterOriginList(key);
    changeVisible(!key ? false : true);
  }

  function renderSearchModel() {
    return props.showSearch ? (
      <View style={styles.searchWrap}>
        <Image
          style={styles.searchIcon}
          source={require('./static/search.png')}
        />
        <TextInput
          style={styles.inputText}
          value={filterKey}
          placeholder={placeholder}
          placeholderTextColor={dimgray}
          autoCapitalize={'none'}
          autoComplete={'off'}
          autoCorrect={false}
          clearTextOnFocus={true}
          onChangeText={filterList}
          onFocus={
            () => filterList('')
          }
        />
        {
          clearVisible ? (
            <TouchableOpacity onPress={
              () => filterList('')
            }>
              <Image
                style={styles.deleteIcon}
                source={require('./static/delete.png')}
              />
            </TouchableOpacity>
          ) : null
        }
      </View>
    ) : null;
  }

  function renderEmptySections() {
    return (
      <View style={{marginTop: 50}}>
        <Text style={{
          textAlign: 'center',
          color: dimgray,
        }}>
          {emptyText}
        </Text>
      </View>
    );
  }

  function renderSectionHeader({section}) {
    return section.title ? (
      <View style={{
        backgroundColor: lightgray,
        height: titleHeight
      }}>
        <Text style={{
          ...styles.titleText,
          lineHeight: titleHeight
        }}>{section.title}</Text>
      </View>
    ) : null;
  }

  function renderSectionItem({item}) {
    return (
      <View
        style={{
          height: itemHeight,
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.onSelect(item);
          }}
        >
          <Text style={{
            ...styles.childText,
            lineHeight: itemHeight,
          }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function scrollTo(index) {
    listRef.current.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: 0,
      viewOffset: 0,
    });
  }

  return (
    <View style={styles.container}>
      {
        renderSearchModel()
      }
      <View style={{flex: 1}}>
        {
          renderLetterList()
        }
        <SectionList
          ref={listRef}
          sections={sectionList}
          initialNumToRender={20}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderSectionItem}
          ItemSeparatorComponent={() => (<View style={styles.separator}></View>)}
          ListEmptyComponent={renderEmptySections}
          refreshing={true}
          getItemLayout={(data, index) => layouts[index]}
        />
      </View>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const isFullScreen = screenHeight / screenWidth > 1.8;
const lightgray = '#f5f5f5';
const gray = '#aaa';
const dimgray  = '#999';
const darkgray  = '#333';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrap: {
    height: 30,
    width: screenWidth - 21,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    marginBottom: 7,
    borderColor: '#ccc',
    borderWidth: .5,
    borderRadius: 3,
    flexDirection: 'row'
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginTop: 7,
    marginLeft: 8,
  },
  inputText: {
    flex: 1,
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    height: 30,
    fontSize: 13,
    lineHeight: 13,
    textAlignVertical: 'center',
    color: darkgray,
  },
  deleteIcon: {
    width: 16,
    height: 16,
    marginTop: 7,
    marginRight: 10,
  },
  emptyList: {
    marginTop: 100,
    width: screenWidth,
  },
  emptyText: {
    color: dimgray,
    textAlign: 'center',
  },
  sideRight: {
    width: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 9,
  },
  touchLetter: {
    width: 20,
    fontSize: 12,
    textAlign: 'center',
    color: gray,
  },
  titleText: {
    color: dimgray,
    marginLeft: 15,
    fontSize: 15,
  },
  childText: {
    fontSize: 15,
    color: darkgray,
  },
  separator: {
    marginLeft: 20,
    height: .5,
    backgroundColor: lightgray
  }
});
