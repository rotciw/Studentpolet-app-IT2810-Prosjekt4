import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import TableItem from '../tableItem/TableItem';



//List of favorites
class FavoriteTable extends Component{
    constructor(props){
        super(props);
        this.state = {
          data: null,
        }
    }

    keyExtractor = (item, index) => index.toString()

    //Fetches all favorites from asyncstorage, this is called when going to the favorites page to amke sure it is up to date
    getData = async () => {
      try {
        const value = await AsyncStorage.getItem('Favorites');
        this.setState({data:JSON.parse(value)});
      } catch(e) {
        // read error
      }
    }

    removeFavorite = async (favorite) => {
      try {
          let data = await AsyncStorage.getItem('Favorites') || [];
          if (typeof data === 'string'){
            data = JSON.parse(data);
          }
          for(let i = data.length - 1; i >= 0; i--) {
              if(data[i].Varenummer == favorite.Varenummer) {
                  //Fjerner data om det allerede finnes
                 data.splice(i, 1);
              }
          }
          await AsyncStorage.removeItem('Favorites');
          await AsyncStorage.setItem('Favorites', JSON.stringify(data));
        } catch (error) {
          // Error saving data
        }
        this.getData();
      };

    //The view of every item, same as in Table, SwipeOut handles the swipe and delete button
    renderItem = ({ item }) => (
      <Swipeout
      right={[{
        text: 'Delete',
        backgroundColor: '#D11A2A',
        color: "white",
        onPress: () => this.removeFavorite(item),
        type: 'delete'
      }]}
      onOpen={() => this.setState({currItem:item})}
      autoClose={true}

      >
        <TableItem item={item}/>
      </Swipeout>

  )
    render() {
        return(
            <View>
              <NavigationEvents onWillFocus={() => this.getData()} />
              <FlatList
                contentContainerStyle={{ paddingBottom: 35}}
                keyExtractor={this.keyExtractor}
                data={this.state.data}
                renderItem={this.renderItem}
                onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
}


export default FavoriteTable;