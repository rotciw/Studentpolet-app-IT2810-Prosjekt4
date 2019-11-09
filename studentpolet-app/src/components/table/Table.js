import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { observer, inject } from 'mobx-react';
import { styles } from '../../styles/table';
import ItemModal from '../itemModal/ItemModal';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            item: {}
        }
    }

    refreshQuery(keys = "", packaging = "", productSelection = "", country = "",
        yearMin = "", yearMax = "", priceMin = 0, priceMax = 10000,
        skipping = 0, sortAfter = "") {

        // Availbale queries
        const GET_PRODUCTQUERY = gql`
            {
                productQuery(Keys: "${keys}",
                            Packaging: "${packaging}",
                            ProductSelection: "${productSelection}",
                            Country: "${country}",
                            YearMin: "${yearMin}",
                            YearMax: "${yearMax}",
                            PriceMin: ${priceMin},
                            PriceMax: ${priceMax},
                            Skipping: ${skipping},
                            SortAfter: "${sortAfter}") {
                Varenummer
                Varenavn
                Volum
                Pris
                Literpris
                Varetype
                Produktutvalg
                Smak
                Land
                Argang
                Alkohol
                AlkoholPrKrone
                Emballasjetype
                Vareurl
                }
            }`;
        return GET_PRODUCTQUERY;
    };


    onPress(item) {
        this.props.modalStore.setModalVisible()
        this.setState({item: item})
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.Varenavn}
            leftAvatar={{ height: 64, width: 32, resizeMode: 'contain', source: { uri: "https://bilder.vinmonopolet.no/cache/200x200-0/" + item.Varenummer + "-1.jpg" } }}
            subtitle={"Alkohol Pr. Krone: " + item.AlkoholPrKrone}
            chevron
            bottomDivider
            onPress={() => this.onPress(item)}
        />
    )

    renderFooter = () => {
        return (
            <View style={styles.activity}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    handleLoadMore = (fetchMore) => {
        this.props.paginationStore.currentPage += 1;

        fetchMore({
            query: this.refreshQuery(
                this.props.searchBarStore.searchBarValue,
                this.props.filterStore.packagingFilter,
                this.props.filterStore.productSelectionFilter,
                this.props.filterStore.countryFilter,
                this.props.filterStore.yearMinFilter,
                this.props.filterStore.yearMaxFilter,
                this.props.filterStore.priceMinFilter,
                this.props.filterStore.priceMaxFilter,
                this.props.paginationStore.currentPage,
                this.props.sortStore.sortAfter
            ),
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.productQuery.length === 0) {
                    return prev;
                }
                return {
                    // Concatenate the new feed results after the old ones
                    productQuery: prev.productQuery.concat(fetchMoreResult.productQuery),
                };
            }
        })
    };



    render() {
        return (
            <Query query={
                this.refreshQuery(
                    this.props.searchBarStore.searchBarValue,
                    this.props.filterStore.packagingFilter,
                    this.props.filterStore.productSelectionFilter,
                    this.props.filterStore.countryFilter,
                    this.props.filterStore.yearMinFilter,
                    this.props.filterStore.yearMaxFilter,
                    this.props.filterStore.priceMinFilter,
                    this.props.filterStore.priceMaxFilter,
                    this.props.paginationStore.firstPage,
                    this.props.sortStore.sortAfter
                )
            }>
                {({ loading, error, data, fetchMore }) => {
                    if (loading && !data) {
                        return (
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 35 }}
                                keyExtractor={this.keyExtractor}
                                data={[]}
                                renderItem={this.renderItem}
                                // ListHeaderComponent={this.renderHeader}
                                ListFooterComponent={this.renderFooter}
                            />
                        )
                    };
                    if (error) return (
                        <View style={styles.activity}>
                            <Text>`Error! ${error.message}`</Text>
                        </View>
                    );
                    return (
                        <View>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 35 }}
                            keyExtractor={this.keyExtractor}
                            data={data.productQuery}
                            renderItem={this.renderItem}
                            // ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={this.renderFooter}
                            onEndReached={() => this.handleLoadMore(fetchMore)}
                            onEndReachedThreshold={0.1}
                        />
                        <ItemModal
                            itemName={this.state.item.Varenavn}
                            itemNumber={this.state.item.Varenummer}
                            itemType={this.state.item.Varetype}
                            itemCountry={this.state.item.Land}
                            itemVolume={this.state.item.Volum}
                            itemAlcoholPercentage={this.state.item.Alkohol}
                            itemYear={this.state.item.Argang}
                            itemTaste={this.state.item.Smak}
                            itemLitrePrice={this.state.item.Literpris}
                            itemPackaging={this.state.item.Emballasjetype}
                            itemSelection={this.state.item.Produktutvalg}
                            itemLink={this.state.item.Vareurl}
                        />
                        </View>
                    );
                }}
            </Query>
        );
    }

}

export default inject('sortStore', 'filterStore', 'searchBarStore', 'paginationStore', 'modalStore')(observer(Table));
