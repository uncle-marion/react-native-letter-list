import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const titleHeight = 36;
const itemHeight = 44;

function handlerNodeInfo (list = []) {
  const letterList = list && list.length ? list.map(item => item.letter) : [];

  const letterItemHeight = 26 - letterList.length + 20;
  const letterListHeight = letterItemHeight * letterList.length;
  
  const positions = [];
  let position = 0;
  for (item of list) {
    positions.push(position);
    position += titleHeight + itemHeight * item.childList.length;
  }

  return {
    letterList,
    letterItemHeight,
    letterListHeight,
    letterListTop: (screenHeight - letterListHeight) / 2 - 100,
    positions,
    totalHeight: position + 10
  }
}

export default class IndexList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showSearch: props.showSearch || false,
      letterName: props.letterName || 'letter',
      childListName: props.childListName || 'childList',
      childTextName: props.childTextName || 'name',
      titleHeight: props.titleHeight || 36,
      itemHeight: props.itemHeight || 44,
      emptyText: props.emptyText || 'No Data',
      sharchPlaceholder: props.sharchPlaceholder || 'Enter keywords to search',

      inputText: '',
      list: props.list,
      originalList: props.list,

      ...handlerNodeInfo(props.list),
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      list: props.list,
      ...handlerNodeInfo(props.list),
    });
  }

  scrollTo(index) {
    this.listView.scrollTo({
      y: this.state.positions[index], animated: true
    });
  }

  matchIndexList(key) {
    const newList = [];
    for (const item of this.state.originalList) {
      const newChild = {
        letter: item[this.state.letterName],
        [this.state.childListName]: [],
      };
      for (const child of item[this.state.childListName]) {
        if (child[this.state.childTextName].indexOf(key) > -1) {
          newChild[this.state.childListName].push(child);
        }
      }
      if (newChild[this.state.childListName].length) {
        newList.push(newChild);
      }
    }
    this.setState({
      list: newList,
      ...handlerNodeInfo(newList),
    });
  }

  onTextChanged(value) {
    this.setState({
      inputText: value
    });
    clearTimeout(this.submitDelay);
    if (!value) {
      const list = [].concat(this.state.originalList)
      this.setState({
        list,
        ...handlerNodeInfo(list)
      });
      return;
    }
    this.submitDelay = setTimeout(() => {
      this.matchIndexList(value);
    }, 300);
  }

  onDeletePress() {
    this.setState({
      inputText: ''
    });
    const list = [].concat(this.state.originalList)
    this.setState({
      list,
      ...handlerNodeInfo(list)
    });
  }

  createSearch() {
    if (!this.state.showSearch) {
      return;
    }
    return (
      <View style={styles.searchWrap}>
        <Image
          style={styles.searchIcon}
          source={require('./static/search.png')}
        />
        <TextInput
          style={styles.inputText}
          autoCapitalize={'none'}
          autoComplete={'off'}
          autoCorrect={false}
          clearTextOnFocus={true}
          defaultValue={this.state.searchPlaceholder}
          maxLength={6}
          onChangeText={value => this.onTextChanged(value)}
          onFocus={() => this.onDeletePress()}
          value={this.state.inputText}
          placeholder={this.state.sharchPlaceholder}
        />
        <TouchableOpacity onPress={() => this.onDeletePress()}>
          <Image
            style={styles.deleteIcon}
            source={require('./static/delete.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  createLetterList() {
    if (!this.state.letterList.length || this.state.totalHeight < screenHeight) {
      return;
    }
    return (
      <View style={{
        ...styles.touchLetterList,
        marginTop: this.state.letterListTop,
        height: this.state.letterListHeight,
      }}>
        {
          this.state.letterList.map((letter, index) => {
            return (
              <TouchableOpacity
                style={{height: this.state.letterItemHeight}}
                key={index}
                activeOpacity={0.75}
                onPressIn={() => {
                  this.scrollTo(index);
                }}
              >
                <Text style={styles.touchLetter}>{letter}</Text>
              </TouchableOpacity>
            );
          })
        }
      </View>
    );
  }

  createChildList(childNode, index) {
    return (
      <View
        style={styles.childNode}
        key={index}
      >
        <View style={styles.childTitle}>
          <Text style={styles.titleText}>{childNode.letter}</Text>
        </View>
        <View style={styles.childList}>
          {
            childNode[this.state.childListName] && childNode[this.state.childListName].map((item, index) => {
              return (
                <View
                  style={styles.childItem}
                  key={index}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.props.onSelect(item);
                    }}
                  >
                    <Text style={styles.childText}>{ item[this.state.childTextName]}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          }
        </View>
      </View>
    )
  }

  render() {
    console.log(this.state);

    return (
      <View style={styles.container}>
        {
          this.createSearch()
        }
        <View style={{flex: 1}}>
          <View style={styles.sideRight}>
            {
              this.createLetterList()
            }
          </View>
          <ScrollView style={{flex: 1}} ref={view => this.listView = view}>
            <View style={{height: this.state.totalHeight}}>
              {
                this.state.list.length ? this.state.list.map((item, index) => {
                  return this.createChildList(item, index);
                }) : (
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyText}>{this.state.emptyText}</Text>
                  </View>
                )
              }
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

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
    marginLeft: 8,
  },
  deleteIcon: {
    width: 16,
    height: 16,
    marginTop: 7,
    marginRight: 10,
  },
  emptyList: {
    marginTop: 100,
    height: 100,
    width: screenWidth
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
  sideRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 20,
    zIndex: 9,
    backgroundColor: '#fff',
  },
  touchLetter: {
    width: 20,
    fontSize: 12,
    textAlign: 'center',
    color: '#a2a2a2',
  },
  childNode: {
    width: screenWidth,
  },
  childTitle: {
    backgroundColor: '#f7f7f7',
    height: titleHeight,
    width: screenWidth,
  },
  titleText: {
    color: '#999',
    lineHeight: titleHeight,
    marginLeft: 15,
    fontSize: 14,
  },
  childList: {
    width: screenWidth,
  },
  childItem: {
    marginLeft: 20,
    height: itemHeight,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 0.5,
  },
  childText: {
    fontSize: 15,
    lineHeight: itemHeight,
    color: '#333',
  }
});
