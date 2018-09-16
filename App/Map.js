import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export class MapScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: [{latitude: 42.3770, longitude: -71.1167}],
            currCoor: {latitude: 0, longitude: 0, timestamp: 0},
        }
    }
    componentDidMount() {
        navigator.geolocation.watchPosition((pos) => this.setState({currCoor: {latitude: pos.coords.latitude, longitude: pos.coords.longitude, timestamp: pos.timestamp}}))
    }
    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.map} region={{
                        latitude: 42.3601,
                        longitude: -71.0942,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}>
                    {this.state.nodes.map(ele => <Marker
                        key={ele}
                        coordinate={ele}
                        onPress={() => this.props.navigation.navigate('Profile', {user: "a", userToken: "a", isLoading: true})}
                        image={require('./assets/images/grey_question_mark.png')}
                    />)}
                    <Marker coordinate={{latitude: this.state.currCoor.latitude, longitude: this.state.currCoor.longitude}}/>
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
})