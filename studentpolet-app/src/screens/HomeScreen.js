import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Table from '../components/table/Table'
import Header from '../components/header/Header';
import HeaderSearchBar from '../components/headerSearchBar/HeaderSearchBar';
import FilterGroup from '../components/filterGroup/FilterGroup';
import { styles } from '../styles/homeScreen';

export default function HomeScreen() {
  return (
    // Home screen for the app, here all relevant components are rendered
    <SafeAreaView style={styles.container}>
      <Header />
      <HeaderSearchBar />
      <View style={{backgroundColor: 'white'}}>
        <Table />
      </View>
      <FilterGroup />
    </SafeAreaView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

